import { assert } from 'chai';
import Politician from '../../entity/Politician';
import PoliticianRepository from './PoliticianRepository';
import { container } from '../../inversify.config';
import { TYPES } from '../../types';

describe('Politician repository tests', () => {

    let PoliticianRepository: PoliticianRepository;

    const Politician1 = new Politician();
    Politician1.name = 'Bob Smith';
    Politician1.party = 'Democratic';
    Politician1.sentiment = 1;

    const Politician2 = new Politician();
    Politician2.name = 'John Shepherd';
    Politician2.party = 'Republican';
    Politician2.sentiment = 2;

    it('Can get all', async () => {
        PoliticianRepository = container.get<PoliticianRepository>(TYPES.PoliticianRepository);

        const firstInsert = await PoliticianRepository.insert(Politician1);
        const secondInsert = await PoliticianRepository.insert(Politician2);

        const Politicians = await PoliticianRepository.get({});

        assert.includeDeepMembers(Politicians, [firstInsert, secondInsert]);
    });

    it('Can get', async() => {
        const Politician = await PoliticianRepository.insert(Politician1);

        const PoliticianInserted = await PoliticianRepository.getOne(Politician.id);
        assert.deepEqual(PoliticianInserted, Politician);
    });

    it('Can delete', async () => {
        const Politician = await PoliticianRepository.insert(Politician1);
        await PoliticianRepository.delete(Politician.id);

        const Politicians: Array<Politician> = await PoliticianRepository.get({id: Politician.id});

        assert.isEmpty(Politicians);
    });

    it('Can update', async () => {
        const Politician = await PoliticianRepository.insert(Politician1);
        Politician.name = 'New Name';
        await PoliticianRepository.update(Politician);

        const updatedPolitician = await PoliticianRepository.getOne(Politician.id);

        assert.deepEqual(updatedPolitician, Politician);
    })
});