import _findIndex from 'lodash/findIndex';
import _floor from 'lodash/floor';
import _isArray from 'lodash/isArray';
import _isNil from 'lodash/isNil';
import _random from 'lodash/random';
import _without from 'lodash/without';
import AirportModel from '../airport/AirportModel';
import RouteModel from '../aircraft/FlightManagementSystem/RouteModel';
import { TIME } from '../constants/globalConstants';
import { nm } from '../utilities/unitConverters';
import { isEmptyOrNotObject } from '../utilities/validatorUtilities';
import { distance2d } from '../math/distance';
import { ENVIRONMENT } from '../constants/environmentConstants';
import { avg } from '../math/core';

// Track which STAR routes have already spawned initial aircraft
// This prevents multiple entry points of the same STAR from spawning simultaneously
const spawnedStarRoutes = new Set();

/**
 * Check if there are any aircraft within the specified distance of the given position
 *
 * @function _checkAircraftProximity
 * @param position {array<number>} Position to check (x, y in km)
 * @param aircraftController {AircraftController} Controller to check aircraft
 * @param minDistanceNm {number} Minimum distance in nautical miles
 * @return {boolean} True if aircraft is too close to spawn
 */
const _checkAircraftProximity = (position, aircraftController, minDistanceNm = 15) => {
    if (!aircraftController || !aircraftController.aircraft || !aircraftController.aircraft.list) {
        return false; // No aircraft controller available, allow spawn
    }

    if (!position || !Array.isArray(position) || position.length < 2) {
        return false; // Invalid position, allow spawn
    }

    const minDistanceKm = minDistanceNm * 1.852; // Convert nm to km

    for (let i = 0; i < aircraftController.aircraft.list.length; i++) {
        const aircraft = aircraftController.aircraft.list[i];
        if (aircraft && aircraft.relativePosition && Array.isArray(aircraft.relativePosition) &&
            aircraft.relativePosition.length >= 2) {
            // Check if aircraft is visible (if method exists)
            const isVisible = aircraft.isVisible ? aircraft.isVisible() : true;

            if (isVisible) {
                const distance = distance2d(aircraft.relativePosition, position);
                if (distance < minDistanceKm) {
                    return true; // Too close to another aircraft
                }
            }
        }
    }

    return false; // Safe to spawn
};

/**
 * Calculate position along a route at a given offset distance
 *
 * @function _calculatePositionAlongRoute
 * @param waypointModelList {array<WaypointModel>} List of waypoints along the route
 * @param offsetNm {number} Distance along route in nautical miles
 * @return {array<number>|null} Position [x, y] in km, or null if invalid
 */
const _calculatePositionAlongRoute = (waypointModelList, offsetNm) => {
    if (!waypointModelList || waypointModelList.length === 0) {
        return null;
    }

    const offsetKm = offsetNm * 1.852; // Convert nm to km
    let distanceTraveled = 0;

    for (let i = 1; i < waypointModelList.length; i++) {
        const currentWaypoint = waypointModelList[i];
        const previousWaypoint = waypointModelList[i - 1];

        if (currentWaypoint.isVectorWaypoint || previousWaypoint.isVectorWaypoint) {
            continue;
        }

        const segmentDistance = distance2d(previousWaypoint.relativePosition, currentWaypoint.relativePosition);

        if (distanceTraveled + segmentDistance >= offsetKm) {
            // Position is on this segment
            const remainingDistance = offsetKm - distanceTraveled;
            const ratio = remainingDistance / segmentDistance;

            // Interpolate between waypoints
            const x = previousWaypoint.relativePosition[0] +
                     (currentWaypoint.relativePosition[0] - previousWaypoint.relativePosition[0]) * ratio;
            const y = previousWaypoint.relativePosition[1] +
                     (currentWaypoint.relativePosition[1] - previousWaypoint.relativePosition[1]) * ratio;

            return [x, y];
        }

        distanceTraveled += segmentDistance;
    }

    // If offset is beyond the route, return the last waypoint position
    const lastWaypoint = waypointModelList[waypointModelList.length - 1];
    return lastWaypoint.relativePosition;
};

/**
 * Reset the STAR route tracking for a new scenario
 * This should be called when starting a new airport/scenario
 */
export const resetStarRouteTracking = () => {
    spawnedStarRoutes.clear();
};

/**
 * Return an array whose indices directly mirror those of `waypointModelList`, except it
 * contains the distances along the route at which each waypoint lies from the spawn point
 *
 * @function _calculateOffsetsToEachWaypointInRoute
 * @param waypointModelList {array<WaypointModel>} array of all waypoints along the route
 * @return {array<number>} offset distance from spawn point to each waypoint
 */
export function _calculateOffsetsToEachWaypointInRoute(waypointModelList) {
    // begin by storing the first fix's offset: a distance of 0 from the spawn point
    const waypointOffsetMap = [0];
    let totalDistanceTraveled = 0;

    // continue with second waypoint, because first is already stored
    for (let i = 1; i < waypointModelList.length; i++) {
        // Skip if either waypoint is undefined or is a vector waypoint
        if (!waypointModelList[i] || !waypointModelList[i - 1] ||
            waypointModelList[i].isVectorWaypoint || waypointModelList[i - 1].isVectorWaypoint) {
            continue;
        }

        const previousWaypointModel = waypointModelList[i - 1];
        const nextWaypointModel = waypointModelList[i];
        const distanceToNextWaypoint = previousWaypointModel.calculateDistanceToWaypoint(nextWaypointModel);
        totalDistanceTraveled += distanceToNextWaypoint;

        waypointOffsetMap.push(totalDistanceTraveled);
    }

    return waypointOffsetMap;
}

/**
 * Create an array of the various altitude restrictions along the route, and the offset distances at which they exist
 *
 * Note that unlike the `waypointOffsetMap`, the altitude offset array DOES NOT mirror the indices
 * of the `waypointModelList`. Only offsets and altitudes of altitude-restricted waypoints are included.
 *
 * Also note that this is designed to retrieve bottom altitudes used in descent. It could probably
 * be reused for departures, just by doing a Math.max() instead of Math.min() below
 *
 * @function _calculateAltitudeOffsets
 * @param waypointModelList {array<WaypointModel>} array of all waypoints along the route
 * @param waypointOffsetMap {array<number>} offset distance from spawn point to each waypoint
 * @return {array<array<number>>} [[offsetDistance, altitude], [offsetDistance, altitude], ...]
 */
export function _calculateAltitudeOffsets(waypointModelList, waypointOffsetMap) {
    const altitudeOffsets = [];

    for (let i = 0; i < waypointModelList.length; i++) {
        const waypointModel = waypointModelList[i];

        if (!waypointModel.hasAltitudeRestriction) {
            continue;
        }

        const altitudes = _without([waypointModel.altitudeMaximum, waypointModel.altitudeMinimum], -1);

        altitudeOffsets.push([
            waypointOffsetMap[i],
            Math.min(...altitudes)
        ]);
    }

    return altitudeOffsets;
}

/**
 * Calculate the interpolated altitude along the glidepath at the given distance along the route from the spawn point
 *
 * @function _calculateAltitudeAtOffset
 * @param altitudeOffsets {array<array<number>>} information about location of altitude restrictions
 * @param offsetDistance {number} distance along route at which we want to know the ideal spawn altitude
 * @return {number} ideal spawn altitude, in feet (rounded up to nearest thousand)
 */
export function _calculateAltitudeAtOffset(altitudeOffsets, offsetDistance) {
    const indexOfDistance = 0;
    const indexOfAltitude = 1;
    const indexOfNextAltitudeRestriction = _findIndex(altitudeOffsets, (altitudeOffset) => {
        return altitudeOffset[indexOfDistance] >= offsetDistance;
    });
    let indexOfPreviousAltitudeRestriction = indexOfNextAltitudeRestriction - 1;

    if (indexOfPreviousAltitudeRestriction < -1) {
        indexOfPreviousAltitudeRestriction = altitudeOffsets.length - 1;
    }

    if (indexOfNextAltitudeRestriction < 0) { // no restrictions ahead
        if (indexOfPreviousAltitudeRestriction < 0) { // no restrictions ahead or behind
            throw new TypeError('Expected altitude restrictions to calculate appropriate spawn altiude, but none were received.');
        }

        return altitudeOffsets[indexOfPreviousAltitudeRestriction][indexOfAltitude];
    }

    if (indexOfPreviousAltitudeRestriction < 0) { // have restrictions ahead, but none behind
        return _floor(altitudeOffsets[indexOfNextAltitudeRestriction][indexOfAltitude], -3);
    }

    const previousAltitudeRestriction = altitudeOffsets[indexOfPreviousAltitudeRestriction];
    const nextAltitudeRestriction = altitudeOffsets[indexOfNextAltitudeRestriction];
    const distanceBetweenRestrictions = nextAltitudeRestriction[indexOfDistance] - previousAltitudeRestriction[indexOfDistance];
    const altitudeBetweenRestrictions = nextAltitudeRestriction[indexOfAltitude] - previousAltitudeRestriction[indexOfAltitude];
    const distanceFromPreviousRestrictionToOffsetDistance = offsetDistance - previousAltitudeRestriction[indexOfDistance];
    const progressBetweenRestrictions = distanceFromPreviousRestrictionToOffsetDistance / distanceBetweenRestrictions;
    const altitudeChangeFromPreviousRestriction = altitudeBetweenRestrictions * progressBetweenRestrictions;

    return _floor(previousAltitudeRestriction[indexOfAltitude] + altitudeChangeFromPreviousRestriction, -3);
}

/**
 * Calculate the ideal spawn altitude at the given distance along the route from the spawn point
 *
 * @function _calculateIdealSpawnAltitudeAtOffset
 * @param altitudeOffsets {array<array<number>>} information about location of altitude restrictions
 * @param offsetDistance {number} distance along route at which we want to know the ideal spawn altitude
 * @param spawnSpeed {number} airspeed at which to spawn the aircraft
 * @param spawnAltitude {number|array<number>} altitude specified in the spawn pattern json
 * @param totalDistance {number} distance along route from spawn point to airspace boundary
 * @param airspaceCeiling {number} altitude of the top of our airspace
 * @return {number} ideal spawn altitude, in feet (rounded up to nearest thousand)
 */
export function _calculateIdealSpawnAltitudeAtOffset(
    altitudeOffsets,
    offsetDistance,
    spawnSpeed,
    spawnAltitude,
    totalDistance,
    airspaceCeiling
) {
    const indexOfDistance = 0;
    const indexOfAltitude = 1;
    let firstAltitudeRestriction = altitudeOffsets[0];

    if (!firstAltitudeRestriction) { // no altitude restrictions at all
        firstAltitudeRestriction = [totalDistance, airspaceCeiling];
    }

    if (offsetDistance >= firstAltitudeRestriction[indexOfDistance]) {
        return _calculateAltitudeAtOffset(altitudeOffsets, offsetDistance);
    }

    const distanceToFirstAltitudeRestriction = firstAltitudeRestriction[indexOfDistance] - offsetDistance;
    const minutesToFirstAltitudeRestriction = distanceToFirstAltitudeRestriction / spawnSpeed * TIME.ONE_HOUR_IN_MINUTES;
    const assumedDescentRate = 1000;
    const highestAcceptableAltitude = firstAltitudeRestriction[indexOfAltitude] +
        (assumedDescentRate * minutesToFirstAltitudeRestriction);

    if (_isArray(spawnAltitude)) {
        spawnAltitude = _random(spawnAltitude[0] / 1000, spawnAltitude[1] / 1000) * 1000;
    }

    return Math.min(_floor(highestAcceptableAltitude, -3), spawnAltitude);
}

/**
 * Loop through `waypointModelList` and determine where along the route an
 * aircraft should spawn
 *
 * @function _calculateSpawnPositionsAndAltitudes
 * @param waypointModelList {array<WaypointModel>}
 * @param spawnOffsets {array}
 * @param spawnSpeed {number}
 * @param spawnAltitude {number}
 * @param totalDistance {number} distance along route from spawn point to airspace boundary
 * @return spawnPositions {array<number>} distances along route, in nm
 */
function _calculateSpawnPositionsAndAltitudes(
    waypointModelList,
    spawnOffsets,
    spawnSpeed,
    spawnAltitude,
    totalDistance,
    airspaceCeiling,
    // routeString = '' // Unused for now
) {
    const spawnPositionsAndAltitudes = [];
    const waypointOffsetMap = _calculateOffsetsToEachWaypointInRoute(waypointModelList);
    const altitudeOffsets = _calculateAltitudeOffsets(waypointModelList, waypointOffsetMap);

    // for each new aircraft
    for (let i = 0; i < spawnOffsets.length; i++) {
        const spawnOffset = spawnOffsets[i];
        const nextWaypointIndex = _findIndex(waypointOffsetMap, (distanceToWaypoint) => {
            // Purposefully using strict comparison:
            // If we return true here when distanceToWaypoint is equal to spawnOffset,
            // the previousWaypointModel and the nextWaypointModel will be the same for
            // the last item (the spawn point) resulting in the incapacity to compute a
            // heading.
            return distanceToWaypoint > spawnOffset;
        });

        // Skip if we can't find a valid waypoint index
        if (nextWaypointIndex === -1 || nextWaypointIndex >= waypointModelList.length) {
            continue;
        }

        const nextWaypointModel = waypointModelList[nextWaypointIndex];
        const previousWaypointIndex = Math.max(0, nextWaypointIndex - 1);
        const previousWaypointModel = waypointModelList[previousWaypointIndex];

        // Skip if either waypoint is undefined
        if (!nextWaypointModel || !previousWaypointModel) {
            continue;
        }
        const distanceFromPreviousWaypointToSpawnPoint = spawnOffset - waypointOffsetMap[previousWaypointIndex];
        const heading = previousWaypointModel.calculateBearingToWaypoint(nextWaypointModel);
        const spawnPositionModel = previousWaypointModel.positionModel.generateDynamicPositionFromBearingAndDistance(
            heading,
            distanceFromPreviousWaypointToSpawnPoint
        );
        let altitude = _calculateIdealSpawnAltitudeAtOffset(
            altitudeOffsets,
            spawnOffset,
            spawnSpeed,
            spawnAltitude,
            totalDistance,
            airspaceCeiling
        );

        // Add aggressive altitude variation to prevent identical altitudes
        // Use true random variation for more natural altitude distribution
        const altitudeVariation = (Math.random() - 0.5) * 8000; // -4000 to +4000 ft
        altitude = Math.max(2000, altitude + altitudeVariation); // Ensure minimum 2000 ft

        spawnPositionsAndAltitudes.push({
            altitude,
            heading,
            nextFix: nextWaypointModel.name,
            positionModel: spawnPositionModel
        });
    }

    return spawnPositionsAndAltitudes;
}

/**
 * Calculate distances along spawn pattern route at which to prespawn aircraft
 *
 * To randomize the spawn locations, the interval between aircraft will vary, but should
 * average out to exactly the `entrailDistance`. The exception is if the `entrailDistance`
 * is less than the `smallestIntervalNm` defined below. In that case, aircraft will be
 * spawned at exactly the `entrailDistance` with no variation due to their proximity.
 *
 * NOTE: Provided there is at least `smallestIntervalNm` distance between them, an aircraft
 * will always be spawned right along the airspace boundary, and another at the first fix.
 *
 * For example, with `smallestIntervalNm = 15`:
 *   - If requesting 8MIT, will spawn exactly 8MIT
 *   - If requesting 30MIT, will spawn each a/c 15MIT-45MIT of the previous arrival
 *
 * @function _assembleSpawnOffsets
 * @param entrailDistance {number}
 * @param totalDistance {number}
 * @param routeString {string}
 * @param aircraftController {AircraftController}
 * @param waypointModelList {array<WaypointModel>}
 * @param airport {AirportModel}
 * @return spawnOffsets {array<number>} distances along route, in nm
 */
const _assembleSpawnOffsets = (
    entrailDistance,
    totalDistance = 0,
    routeString = '', // eslint-disable-line no-unused-vars
    aircraftController = null,
    waypointModelList = [],
    airport = null // eslint-disable-line no-unused-vars
) => {
    // routeString parameter is currently unused but kept for future use
    // Ensure minimum route distance to prevent aircraft spawning at same position
    const minRouteDistance = 30; // Minimum 30 NM route distance
    const effectiveTotalDistance = Math.max(totalDistance, minRouteDistance);

    // Extract STAR name from route string (e.g., "HIE.HIE3C.GCLP" -> "HIE3C")
    const extractStarName = (route) => {
        const parts = route.split('.');
        // Look for STAR pattern (usually the middle part that ends with a number)
        for (let i = 1; i < parts.length - 1; i++) {
            const part = parts[i];
            // Check if this looks like a STAR name (contains letters and ends with number)
            if (/^[A-Z]+\d+[A-Z]*$/.test(part)) {
                return part;
            }
        }
        return null;
    };

    const starName = extractStarName(routeString);

    // Only apply STAR-specific logic to arrival routes (STARs)
    // Check if this is an arrival route by seeing if it ends with an airport ICAO
    // Arrival routes typically end with airport ICAO (e.g., "BETHL.GRNPA1.KLAS07R" ends with airport)
    const isArrivalRoute = starName && !routeString.includes('..') && routeString.includes('.');
    if (starName && isArrivalRoute) {
        // For initial spawn (scenario start), limit to 1 aircraft per STAR route
        if (spawnedStarRoutes.has(starName)) {
            // This STAR has already spawned an initial aircraft, don't spawn another
            return [];
        }

        // 50% chance of spawning initial aircraft (to prevent approach overload with many STARs)
        const spawnChance = Math.random() * 100;

        if (spawnChance > 50) {
            // Don't spawn initial aircraft for this route
            return [];
        }

        // Mark this STAR as having spawned an initial aircraft
        spawnedStarRoutes.add(starName);
    }

    // Check if STAR is too close to ATC boundary (< 30nm)
    // If so, only spawn at the first fix, not along the route
    const isCloseToBoundary = effectiveTotalDistance < 30;

    // Random distance from 5-30 NM from boundary for those that do spawn
    const distanceFromBoundary = Math.random() * 25 + 5; // 5-30 NM from boundary
    const offsetClosestToAirspace = effectiveTotalDistance - distanceFromBoundary;
    // dont spawn aircraft closer than 6 MIT
    const clampedEntrailDistance = Math.max(6, entrailDistance);
    let smallestIntervalNm = 25;
    // do not allow prespawned aircraft to have a spacing less than `minimumInTrailNm`
    const largestIntervalNm = Math.max(
        clampedEntrailDistance,
        clampedEntrailDistance + (clampedEntrailDistance - smallestIntervalNm)
    );

    if (clampedEntrailDistance < 8) {
        console.error(
            `Too many aircraft requested, calculated MIT is ${entrailDistance}, limiting MIT to ${clampedEntrailDistance}`
        );
    }

    // if requesting less than `smallestIntervalNm`, spawn all AT `entrailDistance`
    if (smallestIntervalNm > largestIntervalNm) {
        smallestIntervalNm = largestIntervalNm;
    }

    // Generate spawn positions along the route with proximity-aware spacing
    const spawnOffsets = [];

    // Helper function to check if a position is safe to spawn at
    const isSafeToSpawn = (offset) => {
        if (!waypointModelList || waypointModelList.length === 0 || !aircraftController) {
            return true; // If we can't check proximity, allow spawn
        }

        const position = _calculatePositionAlongRoute(waypointModelList, offset);
        if (!position) {
            return false; // Invalid position
        }

        return !_checkAircraftProximity(position, aircraftController, 15);
    };

    // If STAR is too close to boundary, only spawn at the first fix
    if (isCloseToBoundary) {
        if (isSafeToSpawn(0)) {
            spawnOffsets.push(0); // Only at the first fix
        }
    } else {
        // Try to spawn at boundary first
        if (isSafeToSpawn(offsetClosestToAirspace)) {
            spawnOffsets.push(offsetClosestToAirspace);
        }

        let distanceAlongRoute = offsetClosestToAirspace;
        let attempts = 0;
        const maxAttempts = 10; // Prevent infinite loops

        // distance between successive arrivals in nm
        while (distanceAlongRoute > smallestIntervalNm && attempts < maxAttempts) {
            attempts += 1;

            // Use random interval for more natural spacing
            const interval = Math.random() * (largestIntervalNm - smallestIntervalNm) + smallestIntervalNm;
            distanceAlongRoute -= interval;

            if (distanceAlongRoute < smallestIntervalNm) {
                break;
            }

            // Add random offset to each position to break the pattern
            const positionOffset = Math.random() * 10 + 2; // 2-12 NM offset per position
            const adjustedPosition = Math.max(0, distanceAlongRoute + positionOffset);

            // Only add if it's safe to spawn there
            if (isSafeToSpawn(adjustedPosition)) {
                spawnOffsets.push(adjustedPosition);
            }
        }

        // Try to spawn an aircraft at the first fix of the route
        if (isSafeToSpawn(0)) {
            spawnOffsets.push(0);
        }
    }

    return spawnOffsets;
};

/**
 * Returns the total distance from beginning to end of the provided route, along the route's course
 *
 * @function _calculateTotalDistanceAlongRoute
 * @param waypointModelList {array<WaypointModel>}
 * @param airport {AirportModel}
 * @return {number}
 */
const _calculateTotalDistanceAlongRoute = (waypointModelList, airport) => {
    // find last fix along STAR that is outside of airspace, ie: next fix is within airspace
    // distance between closest fix outside airspace and airspace border in nm
    let totalDistance = 0;

    // Iteration started at index 1 to ensure two elements are available. It is
    // already an expectation that aircraft must have two waypoints, so this
    // should not be a problem here.
    for (let i = 1; i < waypointModelList.length; i++) {
        const waypointModel = waypointModelList[i];
        const previousWaypoint = waypointModelList[i - 1];

        if (waypointModel.isVectorWaypoint || previousWaypoint.isVectorWaypoint) {
            continue;
        }

        const distanceBetweenWaypoints = nm(distance2d(previousWaypoint.relativePosition, waypointModel.relativePosition));
        let distanceToBoundary = Infinity;

        for (let j = 0; j < airport.airspace.length; j++) {
            const airspace = airport.airspace[j];

            if (airspace.isPointInside2D(waypointModel.relativePosition)) {
                const distanceToAirspace = airspace.distanceToBoundary(previousWaypoint.relativePosition);
                // find shortest distance, since the waypoint might be inside multiple airspace polygons
                distanceToBoundary = Math.min(distanceToBoundary, distanceToAirspace);
            }
        }

        // if waypointModel is within any of our airspace
        if (distanceToBoundary !== Infinity) {
            totalDistance += distanceToBoundary;

            break;
        }

        totalDistance += distanceBetweenWaypoints;
    }

    return totalDistance;
};

/**
 * Calculate heading, nextFix and position data to be used when creating an
 * `AircraftModel` along a route.
 *
 * @function _preSpawn
 * @param spawnPatternJson {object|SpawnPatternModel}
 * @param airport {AirportModel}
 * @param aircraftController {AircraftController}
 * @return {array<object>}
 */
const _preSpawn = (spawnPatternJson, airport, aircraftController = null) => {
    const spawnRate = spawnPatternJson.rate;

    if (spawnRate <= 0) {
        return [];
    }

    const airspaceCeiling = airport.maxAssignableAltitude;
    const spawnSpeed = spawnPatternJson.speed;
    const spawnAltitude = spawnPatternJson.altitude;
    const spawnAvgAltitude = Array.isArray(spawnAltitude) ? avg(spawnAltitude) : spawnAltitude;
    // convert IAS to TAS for better estimate
    const trueAirspeedIncreaseFactor = spawnAvgAltitude * ENVIRONMENT.DENSITY_ALT_INCREASE_FACTOR_PER_FT;
    const spawnEstTrueAirspeed = spawnSpeed * (1 + trueAirspeedIncreaseFactor);
    // distance between each arriving aircraft, in nm.
    const entrailDistance = spawnEstTrueAirspeed / spawnRate;
    const routeModel = spawnPatternJson._routeModel ? spawnPatternJson._routeModel : new RouteModel(spawnPatternJson.route);
    const waypointModelList = routeModel.waypoints;
    const totalDistance = _calculateTotalDistanceAlongRoute(waypointModelList, airport);
    // calculate number of offsets
    const spawnOffsets = _assembleSpawnOffsets(
        entrailDistance,
        totalDistance,
        spawnPatternJson.route,
        aircraftController,
        waypointModelList,
        airport
    );
    // calculate heading, nextFix and position data to be used when creating an `AircraftModel` along a route
    const spawnPositions = _calculateSpawnPositionsAndAltitudes(
        waypointModelList,
        spawnOffsets,
        spawnSpeed,
        spawnAltitude,
        totalDistance,
        airspaceCeiling,
        spawnPatternJson.route
    );

    return spawnPositions;
};

/**
 * Backfill STAR routes with arrivals closer than the spawn point.
 *
 * Should be run only once on airport load.
 *
 * Aircraft spawn at the first point defined in the `arrivals` entry of the airport json file.
 * When that spawn point is very far from the airspace boundary, it obviously takes quite a
 * while for them to reach the airspace. This function spawns arrivals along the route, between
 * the spawn point and the airspace boundary, in order to ensure the player is not kept waiting
 * for their first arrival aircraft.
 *
 * @function buildPreSpawnAircraft
 * @param spawnPatternJson {object|SpawnPatternModel}
 * @param currentAirport {AirportModel}
 * @param aircraftController {AircraftController}
 * @return {array<object>}
 */
export const buildPreSpawnAircraft = (spawnPatternJson, currentAirport, aircraftController = null) => {
    if (_isNil(spawnPatternJson) || _isNil(currentAirport)) {
        throw new TypeError('Invalid parameter(s) passed to buildPreSpawnAircraft. ' +
            'Expected spawnPatternJson and currentAirport to be defined, ' +
            `but received ${typeof spawnPatternJson} and ${typeof currentAirport}`);
    }

    if (isEmptyOrNotObject(spawnPatternJson)) {
        throw new TypeError('Invalid spawnPatternJson passed to buildPreSpawnAircraft. ' +
            `Expected a non-empty object, but received ${typeof spawnPatternJson}`);
    }

    if (!(currentAirport instanceof AirportModel)) {
        throw new TypeError('Invalid currentAirport passed to buildPreSpawnAircraft. ' +
            `Expected instance of AirportModel, but received ${typeof currentAirport}`);
    }

    return _preSpawn(spawnPatternJson, currentAirport, aircraftController);
};
