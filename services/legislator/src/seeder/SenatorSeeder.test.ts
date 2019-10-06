import { anything, capture, instance, mock, verify } from 'ts-mockito';
import { assert } from 'chai';
import SenatorSeeder from './SenatorSeeder';
import LegislatorRepository from '../entity/repositories/LegislatorRepository';
import Legislator from '../entity/Legislator';

describe('Senator seeder tests', () => {

    let senatorSeeder: SenatorSeeder;
    let legislatorRepository: LegislatorRepository;
    let mockRepository;

    before(() => {
        mockRepository = mock<LegislatorRepository>();
        legislatorRepository = instance(mockRepository);
        senatorSeeder = new SenatorSeeder(legislatorRepository);
    });

    it('Can seed', async () => {
        await senatorSeeder.seed();

        const firstLegislator = new Legislator();
        firstLegislator.party = 'Republican';
        firstLegislator.name = 'Richard Shelby';

        const lastLegislator = new Legislator();
        lastLegislator.party = 'Republican';
        lastLegislator.name = 'John Barrasso';

        const [firstInsertedLegislator] = capture(mockRepository.insert).first();
        const [lastInsertedLegislator] = capture(mockRepository.insert).last();

        verify(mockRepository.insert(anything())).times(100);

        assert.deepEqual(firstInsertedLegislator, firstLegislator);
        assert.deepEqual(lastInsertedLegislator, lastLegislator);
    });
});