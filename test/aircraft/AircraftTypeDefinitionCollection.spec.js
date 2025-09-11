/* eslint-disable arrow-parens, max-len, import/no-extraneous-dependencies*/
import ava from 'ava';
import _forEach from 'lodash/forEach';

import AircraftTypeDefinitionCollection from '../../src/assets/scripts/client/aircraft/AircraftTypeDefinitionCollection';
import AircraftTypeDefinitionModel from '../../src/assets/scripts/client/aircraft/AircraftTypeDefinitionModel';
import { AIRCRAFT_DEFINITION_LIST_MOCK } from './_mocks/aircraftMocks';

ava('should throw when passed invalid parameters', (t) => {
    const expectedMessage = /Invalid aircraftTypeDefinitionList passed to AircraftTypeDefinitionCollection constructor\. Expected a non-empty array, but received .*/;

    t.throws(() => new AircraftTypeDefinitionCollection(), {
        instanceOf: TypeError,
        message: expectedMessage
    });
    t.throws(() => new AircraftTypeDefinitionCollection(null), {
        instanceOf: TypeError,
        message: expectedMessage
    });
    t.throws(() => new AircraftTypeDefinitionCollection({}), {
        instanceOf: TypeError,
        message: expectedMessage
    });
    t.throws(() => new AircraftTypeDefinitionCollection([]), {
        instanceOf: TypeError,
        message: expectedMessage
    });
    t.throws(() => new AircraftTypeDefinitionCollection(42), {
        instanceOf: TypeError,
        message: expectedMessage
    });
    t.throws(() => new AircraftTypeDefinitionCollection('threeve'), {
        instanceOf: TypeError,
        message: expectedMessage
    });
    t.throws(() => new AircraftTypeDefinitionCollection(false), {
        instanceOf: TypeError,
        message: expectedMessage
    });
});

ava('does not throw when passed valid parameters', (t) => {
    t.notThrows(() => new AircraftTypeDefinitionCollection(AIRCRAFT_DEFINITION_LIST_MOCK));
});

ava('.findAircraftTypeDefinitionModelByIcao() returns an AircraftTypeDefinitionModel when provided a valid aircraft icao', (t) => {
    const expectedResult = 'B737';
    const collection = new AircraftTypeDefinitionCollection(AIRCRAFT_DEFINITION_LIST_MOCK);
    const result = collection.findAircraftTypeDefinitionModelByIcao('B737');

    t.true(result instanceof AircraftTypeDefinitionModel);
    t.true(result.icao === expectedResult);
});

ava('._buildAircraftTypeDefinitionModelList() returns a list of AircraftTypeDefinitionModel objects', (t) => {
    const collection = new AircraftTypeDefinitionCollection(AIRCRAFT_DEFINITION_LIST_MOCK);
    const results = collection._buildAircraftTypeDefinitionModelList(AIRCRAFT_DEFINITION_LIST_MOCK);

    _forEach(results, (result, i) => {
        t.true(result instanceof AircraftTypeDefinitionModel);
        t.true(result.icao === AIRCRAFT_DEFINITION_LIST_MOCK[i].icao);
    });
});

ava.skip('.getAircraftDefinitionForAirlineId()', (t) => {
    t.true(true);
});

// Tests for new fleet restriction and performance-based selection functionality
ava('._getRandomAircraftTypeFromRestriction() returns random aircraft from restriction list', (t) => {
    const collection = new AircraftTypeDefinitionCollection(AIRCRAFT_DEFINITION_LIST_MOCK);
    const fleetRestriction = ['B737', 'A320', 'CRJ9'];
    
    // Test multiple times to ensure randomness
    for (let i = 0; i < 10; i++) {
        const result = collection._getRandomAircraftTypeFromRestriction(fleetRestriction);
        t.true(fleetRestriction.includes(result));
    }
});

ava('._getRandomAircraftTypeFromRestriction() returns single aircraft when restriction has one item', (t) => {
    const collection = new AircraftTypeDefinitionCollection(AIRCRAFT_DEFINITION_LIST_MOCK);
    const fleetRestriction = ['B737'];
    
    const result = collection._getRandomAircraftTypeFromRestriction(fleetRestriction);
    t.true(result === 'B737');
});

ava('._getRandomAircraftTypeFromRestriction() returns uppercase aircraft type', (t) => {
    const collection = new AircraftTypeDefinitionCollection(AIRCRAFT_DEFINITION_LIST_MOCK);
    const fleetRestriction = ['b737', 'a320'];
    
    const result = collection._getRandomAircraftTypeFromRestriction(fleetRestriction);
    t.true(result === 'B737' || result === 'A320');
});

ava('._getPerformanceBasedAircraftType() returns aircraft suitable for altitude', (t) => {
    const collection = new AircraftTypeDefinitionCollection(AIRCRAFT_DEFINITION_LIST_MOCK);
    
    // Mock airline model with aircraft types
    const mockAirlineModel = {
        getAircraftTypesForFleet: () => ['B737', 'A320', 'AT76'],
        getRandomAircraftType: () => 'B737'
    };
    
    // Mock aircraft definitions with different ceilings
    collection.definitionList = [
        { icao: 'B737', ceiling: 37000 },
        { icao: 'A320', ceiling: 39000 },
        { icao: 'AT76', ceiling: 25000 }
    ];
    
    const result = collection._getPerformanceBasedAircraftType(mockAirlineModel, 'default', 30000);
    
    // Should return B737 or A320 (suitable for FL300), not AT76
    t.true(result === 'B737' || result === 'A320');
});

ava('._getPerformanceBasedAircraftType() handles altitude arrays correctly', (t) => {
    const collection = new AircraftTypeDefinitionCollection(AIRCRAFT_DEFINITION_LIST_MOCK);
    
    const mockAirlineModel = {
        getAircraftTypesForFleet: () => ['B737', 'A320', 'AT76'],
        getRandomAircraftType: () => 'B737'
    };
    
    collection.definitionList = [
        { icao: 'B737', ceiling: 37000 },
        { icao: 'A320', ceiling: 39000 },
        { icao: 'AT76', ceiling: 25000 }
    ];
    
    // Test with altitude array - should use the higher value (35000)
    const result = collection._getPerformanceBasedAircraftType(mockAirlineModel, 'default', [30000, 35000]);
    
    // Should return B737 or A320 (suitable for FL350), not AT76
    t.true(result === 'B737' || result === 'A320');
});

ava('._getPerformanceBasedAircraftType() falls back to default when no suitable aircraft found', (t) => {
    const collection = new AircraftTypeDefinitionCollection(AIRCRAFT_DEFINITION_LIST_MOCK);
    
    const mockAirlineModel = {
        getAircraftTypesForFleet: () => ['AT76'],
        getRandomAircraftType: () => 'AT76'
    };
    
    collection.definitionList = [
        { icao: 'AT76', ceiling: 25000 }
    ];
    
    // Request altitude higher than AT76 ceiling
    const result = collection._getPerformanceBasedAircraftType(mockAirlineModel, 'default', 40000);
    
    // Should fall back to default selection
    t.true(result === 'AT76');
});
