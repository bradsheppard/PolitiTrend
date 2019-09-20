import { assert } from 'chai';
import Legislator from '../../entity/Legislator';
import LegislatorRepository from './LegislatorRepository';
import { container } from '../../inversify.config';
import { TYPES } from '../../types';

describe('Legislator repository tests', () => {

    let legislatorRepository: LegislatorRepository = container.get<LegislatorRepository>(TYPES.LegislatorRepository);
    let testLegislators: Array<Legislator>;

    before(async () => {
        const legislator1 = new Legislator();
        legislator1.id = 1;
        legislator1.firstName = 'bob';
        legislator1.lastName = 'smith';
        legislator1.age = 45;

        const legislator2 = new Legislator();
        legislator2.id = 2;
        legislator2.firstName = 'john';
        legislator2.lastName = 'sheppard';
        legislator2.age = 34;

        testLegislators = [legislator1, legislator2];

        for(let legislator of testLegislators) {
            await legislatorRepository.insert(legislator);
        }
    });

    after(async () => {
        for(let legislator of testLegislators) {
            await legislatorRepository.delete(legislator.id)
        }
    });

    it('Can get all', async () => {
        const legislators = await legislatorRepository.get();

        assert.deepEqual(legislators, testLegislators)
    });
});