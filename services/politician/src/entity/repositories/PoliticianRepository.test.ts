import { assert } from 'chai';
import Politician from '../../entity/Politician';
import PoliticianRepository from './PoliticianRepository';
import { container } from '../../inversify.config';
import { TYPES } from '../../types';

describe('Politician repository tests', () => {

    let politicianRepository: PoliticianRepository;

    const politician1 = new Politician();
    politician1.id = 1;
    politician1.name = 'Bob Smith';
    politician1.party = 'Democratic';
    politician1.sentiment = 1;

    const politician2 = new Politician();
    politician2.id = 2;
    politician2.name = 'John Shepherd';
    politician2.party = 'Republican';
    politician2.sentiment = 2;

    it('Can get all', async () => {
        politicianRepository = container.get<PoliticianRepository>(TYPES.PoliticianRepository);

        const firstInsert = await politicianRepository.insert(politician1);
        const secondInsert = await politicianRepository.insert(politician2);

        const politicians = await politicianRepository.get({});

        assert.includeDeepMembers(politicians, [firstInsert, secondInsert]);
    });

    it('Can get', async() => {
        const politician = await politicianRepository.insert(politician1);

        const politicianInserted = await politicianRepository.getOne(politician.id);
        assert.deepEqual(politicianInserted, politician);
    });

    it('Can delete one', async () => {
        const politician = await politicianRepository.insert(politician1);
        await politicianRepository.deleteOne(politician.id);

        const politicians: Array<Politician> = await politicianRepository.get({id: politician.id});

        assert.isEmpty(politicians);
    });

    it('Can delete all', async() => {
        politicianRepository = container.get<PoliticianRepository>(TYPES.PoliticianRepository);

        await Promise.all([
            politicianRepository.insert(politician1),
            politicianRepository.insert(politician2)
        ]);

        await politicianRepository.delete();

        const politicians = await politicianRepository.get();

        assert.isEmpty(politicians);
    });

    it('Can update', async () => {
        const politician = await politicianRepository.insert(politician1);
        politician.name = 'New Name';
        await politicianRepository.update(politician);

        const updatedPolitician = await politicianRepository.getOne(politician.id);

        assert.deepEqual(updatedPolitician, politician);
    })
});