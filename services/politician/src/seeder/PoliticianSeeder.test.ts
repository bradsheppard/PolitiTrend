import { anything, capture, instance, mock, verify } from 'ts-mockito';
import { assert } from 'chai';
import PoliticianSeeder from './PoliticianSeeder';
import PoliticianRepository from '../entity/repositories/PoliticianRepository';
import Politician from '../entity/Politician';

describe('Politician seeder tests', () => {

    let senatorSeeder: PoliticianSeeder;
    let PoliticianRepository: PoliticianRepository;
    let mockRepository;

    before(() => {
        mockRepository = mock<PoliticianRepository>();
        PoliticianRepository = instance(mockRepository);
        senatorSeeder = new PoliticianSeeder(PoliticianRepository);
    });

    it('Can seed', async () => {
        await senatorSeeder.seed();

        const firstPolitician = new Politician();
        firstPolitician.party = 'Republican';
        firstPolitician.name = 'Richard Shelby';
        firstPolitician.sentiment = 0;

        const lastPolitician = new Politician();
        lastPolitician.party = 'Republican';
        lastPolitician.name = 'John Barrasso';
        lastPolitician.sentiment = 0;

        const [firstInsertedPolitician] = capture(mockRepository.insert).first();
        const [lastInsertedPolitician] = capture(mockRepository.insert).last();

        verify(mockRepository.insert(anything())).times(100);

        assert.deepEqual(firstInsertedPolitician, firstPolitician);
        assert.deepEqual(lastInsertedPolitician, lastPolitician);
    });
});