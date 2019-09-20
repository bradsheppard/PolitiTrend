import { assert } from 'chai';
import Legislator from '../legislator';
import LegislatorRepository from './legislator-repository';
import { container } from '../../inversify.config';
import { TYPES } from '../../types';

describe('Legislator repository tests', () => {

    let legislatorRepository: LegislatorRepository = container.get<LegislatorRepository>(TYPES.LegislatorRepository);

    const testLegislators = [
        new Legislator({
            age: 45,
            firstName: 'bob',
            lastName: 'smith'
        }),
        new Legislator({
            age: 56,
            firstName: 'karen',
            lastName: 'clark'
        })
    ];

    before(async () => {
        for(let legislator of testLegislators) {
            await legislatorRepository.insert(legislator);
        }
    });

    it('Can get all', async() => {
        const legislators = await legislatorRepository.get({});

        assert.deepEqual(legislators, testLegislators)
    });
});