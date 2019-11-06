import { assert } from 'chai';
import Opinion from '../../entity/Opinion';
import OpinionRepository from './OpinionRepository';
import { container } from '../../inversify.config';
import { TYPES } from '../../types';

describe('Opinion repository tests', () => {

    let opinionRepository: OpinionRepository;

    const opinion1 = new Opinion();
    opinion1.politician = 1;
    opinion1.sentiment = 11;
    opinion1.tweet = 111;

    const opinion2 = new Opinion();
    opinion2.politician = 2;
    opinion2.sentiment = 22;
    opinion2.tweet = 222;

    it('Can get all', async () => {
        opinionRepository = container.get<OpinionRepository>(TYPES.OpinionRepository);

        const firstInsert = await opinionRepository.insert(opinion1);
        const secondInsert = await opinionRepository.insert(opinion2);

        const Opinions = await opinionRepository.get({});

        assert.includeDeepMembers(Opinions, [firstInsert, secondInsert]);
    });

    it('Can get', async() => {
        const opinion = await opinionRepository.insert(opinion1);

        const opinionInserted = await opinionRepository.getOne(opinion.id);
        assert.deepEqual(opinionInserted, opinion);
    });

    it('Can delete', async () => {
        const opinion = await opinionRepository.insert(opinion1);
        await opinionRepository.delete(opinion.id);

        const opinions: Array<Opinion> = await opinionRepository.get({id: opinion.id});

        assert.isEmpty(opinions);
    });

    it('Can update', async () => {
        const opinion = await opinionRepository.insert(opinion1);
        opinion.tweet = 1234;
        await opinionRepository.update(opinion);

        const updatedOpinion = await opinionRepository.getOne(opinion.id);

        assert.deepEqual(updatedOpinion, opinion);
    })
});