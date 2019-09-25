import { assert } from 'chai';
import Legislator from '../../entity/Legislator';
import LegislatorRepository from './LegislatorRepository';
import { container } from '../../inversify.config';
import { TYPES } from '../../types';

describe('Legislator repository tests', () => {

    let legislatorRepository: LegislatorRepository;

    const legislator1 = new Legislator();
    legislator1.firstName = 'bob';
    legislator1.lastName = 'smith';
    legislator1.age = 45;

    const legislator2 = new Legislator();
    legislator2.firstName = 'john';
    legislator2.lastName = 'sheppard';
    legislator2.age = 34;

    it('Can get all', async () => {
        legislatorRepository = container.get<LegislatorRepository>(TYPES.LegislatorRepository);

        const firstInsert = await legislatorRepository.insert(legislator1);
        const secondInsert = await legislatorRepository.insert(legislator2);

        const legislators = await legislatorRepository.get({});

        assert.includeDeepMembers(legislators, [firstInsert, secondInsert]);
    });

    it('Can get', async() => {
        const legislator = await legislatorRepository.insert(legislator1);

        const legislatorInserted = await legislatorRepository.getOne(legislator.id);
        assert.deepEqual(legislatorInserted, legislator);
    });

    it('Can delete', async () => {
        const legislator = await legislatorRepository.insert(legislator1);
        await legislatorRepository.delete(legislator.id);

        const legislators: Array<Legislator> = await legislatorRepository.get({id: legislator.id});

        assert.isEmpty(legislators);
    });

    it('Can update', async () => {
        const legislator = await legislatorRepository.insert(legislator1);
        legislator.firstName = 'New Name';
        await legislatorRepository.update(legislator);

        const updatedLegislator = await legislatorRepository.getOne(legislator.id);

        assert.deepEqual(updatedLegislator, legislator);
    })
});