import _find from 'lodash/find';
import _map from 'lodash/map';
import BaseCollection from '../base/BaseCollection';
import AircraftTypeDefinitionModel from './AircraftTypeDefinitionModel';
import { airlineNameAndFleetHelper } from '../airline/airlineHelpers';
import { isEmptyOrNotArray } from '../utilities/validatorUtilities';

/**
 * Collection of `AircraftModel` objects
 *
 * Responsible for creating new `AircraftModel` objects when a spawnInterval
 * fires its `createAircraftWithSpawnPatternModel` callback.
 *
 * This collection also keeps a list of `AircraftTypeDefinitionModel` objects, which define each
 * aircraft type.
 *
 * @class AircraftTypeDefinitionCollection
 * @extends BaseCollection
 */
/* istanbul ignore next */
export default class AircraftTypeDefinitionCollection extends BaseCollection {
    /**
     * @constructor
     * @for AircraftTypeDefinitionCollection
     * @param aircraftTypeDefinitionList {array<object>}
     */
    constructor(aircraftTypeDefinitionList) {
        super();

        if (isEmptyOrNotArray(aircraftTypeDefinitionList)) {
            throw new TypeError('Invalid aircraftTypeDefinitionList passed to AircraftTypeDefinitionCollection constructor. ' +
                `Expected a non-empty array, but received ${typeof aircraftTypeDefinitionList}`);
        }

        /**
         * A collection of `AircraftTypeDefinitionModel` objects
         *
         * Not using the inherited `_items` property here for readability
         * and the fact that we need this property to be public.
         *
         * @property definitionList
         * @type {array}
         * @default []
         */
        this.definitionList = [];

        this.init(aircraftTypeDefinitionList);
    }

    /**
     * Lifecycle method. Should be run only once on instantiation.
     *
     * Initializes instance properties.
     *
     * @for AircraftTypeDefinitionCollection
     * @method init
     * @param aircraftTypeDefinitionList {array<object>}
     */
    init(aircraftTypeDefinitionList) {
        this.definitionList = this._buildAircraftTypeDefinitionModelList(aircraftTypeDefinitionList);
    }

    /**
     * @for AircraftTypeDefinitionCollection
     * @method findAircraftTypeDefinitionModelByIcao
     * @param icao {string}
     * @return {AircraftTypeDefinitionModel}
     */
    findAircraftTypeDefinitionModelByIcao(icao) {
        return _find(this.definitionList, { icao: icao.toUpperCase() });
    }

    /**
     * Given an `airlineId`, find a random aircraft type from the airline.
     *
     * @for AircraftTypeDefinitionCollection
     * @method getAircraftDefinitionForAirlineId
     * @param airlineId {string}
     * @param airlineModel {AirlineModel}
     * @param fleetRestriction {array|null} Optional array of allowed aircraft types
     * @param spawnAltitude {number|array} Altitude for performance-based selection
     * @return aircraftDefinition {AircraftTypeDefinitionModel}
     */
    getAircraftDefinitionForAirlineId(airlineId, airlineModel, fleetRestriction = null, spawnAltitude = null) {
        const { fleet } = airlineNameAndFleetHelper([airlineId]);
        let aircraftType;
        
        if (fleetRestriction && fleetRestriction.length > 0) {
            // Use fleet restriction if provided
            aircraftType = this._getRandomAircraftTypeFromRestriction(fleetRestriction);
        } else {
            // Use performance-based selection if altitude is provided
            if (spawnAltitude !== null) {
                aircraftType = this._getPerformanceBasedAircraftType(airlineModel, fleet, spawnAltitude);
            } else {
                // Default behavior
                aircraftType = airlineModel.getRandomAircraftType(fleet).toUpperCase();
            }
        }
        
        const aircraftDefinition = _find(this.definitionList, { icao: aircraftType });

        if (typeof aircraftDefinition === 'undefined') {
            console.error(`Undefined aircraftDefinition found for ${aircraftType}`);

            // recurse through this method if an error is encountered
            return this.getAircraftDefinitionForAirlineId(airlineId, airlineModel, fleetRestriction, spawnAltitude);
        }

        return aircraftDefinition;
    }

    /**
     * Loop through aircraft defined in the `definitionList` and create an
     * `AircraftTypeDefinitionModel` for each.
     *
     * @for AircraftTypeDefinitionCollection
     * @method _buildAircraftTypeDefinitionModelList
     * @param aircraftTypeDefinitionList {array}
     * @return definitionList {array<AircraftTypeDefinitionModel>}
     * @private
     */
    _buildAircraftTypeDefinitionModelList(aircraftTypeDefinitionList) {
        const definitionList = _map(aircraftTypeDefinitionList, (aircraftDefinition) => {
            // this is not using a direct return simply for readability
            return new AircraftTypeDefinitionModel(aircraftDefinition);
        });

        return definitionList;
    }

    /**
     * Get a random aircraft type from a fleet restriction list
     *
     * @for AircraftTypeDefinitionCollection
     * @method _getRandomAircraftTypeFromRestriction
     * @param fleetRestriction {array} Array of allowed aircraft types
     * @return {string} Random aircraft type from restriction list
     * @private
     */
    _getRandomAircraftTypeFromRestriction(fleetRestriction) {
        const randomIndex = Math.floor(Math.random() * fleetRestriction.length);
        return fleetRestriction[randomIndex].toUpperCase();
    }

    /**
     * Get an aircraft type based on performance characteristics (ceiling vs altitude)
     *
     * @for AircraftTypeDefinitionCollection
     * @method _getPerformanceBasedAircraftType
     * @param airlineModel {AirlineModel}
     * @param fleet {string}
     * @param spawnAltitude {number|array} Spawn altitude
     * @return {string} Appropriate aircraft type based on performance
     * @private
     */
    _getPerformanceBasedAircraftType(airlineModel, fleet, spawnAltitude) {
        // Handle altitude range (take the higher value for safety)
        const targetAltitude = Array.isArray(spawnAltitude) ? Math.max(...spawnAltitude) : spawnAltitude;
        
        // Get all available aircraft types for this airline/fleet
        const availableAircraft = airlineModel.getAircraftTypesForFleet(fleet);
        
        // Filter aircraft that can handle the target altitude (ceiling >= target altitude)
        const suitableAircraft = availableAircraft.filter(aircraftType => {
            const aircraftDefinition = _find(this.definitionList, { icao: aircraftType.toUpperCase() });
            return aircraftDefinition && aircraftDefinition.ceiling >= targetAltitude;
        });
        
        // If no suitable aircraft found, fall back to default selection
        if (suitableAircraft.length === 0) {
            console.warn(`No aircraft suitable for altitude ${targetAltitude}ft found for fleet ${fleet}, using default selection`);
            return airlineModel.getRandomAircraftType(fleet).toUpperCase();
        }
        
        // Return a random aircraft from the suitable ones
        const randomIndex = Math.floor(Math.random() * suitableAircraft.length);
        return suitableAircraft[randomIndex].toUpperCase();
    }
}
