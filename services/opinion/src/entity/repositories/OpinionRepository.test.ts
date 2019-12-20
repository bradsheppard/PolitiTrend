import { assert } from 'chai';
import Opinion from '../../entity/Opinion';
import OpinionRepository from './OpinionRepository';
import { container } from '../../inversify.config';
import { TYPES } from '../../types';

describe('Opinion repository tests', () => {

    let opinionRepository: OpinionRepository;

    let id = 0;

    function createOpinion() {
        id++;
        return <Opinion> {
            tweetText: `test text ${id}`,
            sentiment: id + 0.25,
            tweetId: id.toString(),
            politician: id
        };
    }

    function createOpinionForPolitician(politicianId: number, sentiment: number) {
        id++;
        return <Opinion> {
            tweetText: `test text ${id}`,
            sentiment,
            tweetId: id.toString(),
            politician: politicianId
        };
    }

    before(async () => {
        opinionRepository = container.get<OpinionRepository>(TYPES.OpinionRepository);
        await opinionRepository.delete();
    });

    it('Can get all', async () => {
        const opinion1 = createOpinion();
        const opinion2 = createOpinion();

        const firstInsert = await opinionRepository.insert(opinion1);
        const secondInsert = await opinionRepository.insert(opinion2);

        const Opinions = await opinionRepository.get({});

        assert.deepEqual(Opinions, [firstInsert, secondInsert]);
    });

    it('Can get', async() => {
        const opinion = createOpinion();
        const insertedOpinion = await opinionRepository.insert(opinion);
        opinion.id = insertedOpinion.id;

        const retrievedOpinion = await opinionRepository.getOne(insertedOpinion.id);
        assert.deepEqual(retrievedOpinion, insertedOpinion);
        assert.deepEqual(insertedOpinion, opinion);
    });

    it('Can get by politician', async() => {
        const opinion = createOpinion();
        const insertedOpinion = await opinionRepository.insert(opinion);

        const politicianOpinions = await opinionRepository.get({politician: insertedOpinion.politician});

        for(let politician of politicianOpinions) {
            assert.equal(politician.politician, insertedOpinion.politician);
        }
    });

    it('Can delete', async () => {
        const opinion = createOpinion();
        const insertedOpinion = await opinionRepository.insert(opinion);
        await opinionRepository.deleteOne(insertedOpinion.id);

        const opinions: Array<Opinion> = await opinionRepository.get({id: insertedOpinion.id});

        assert.equal(opinions.length, 0);
    });

    it('Can update', async () => {
        const opinion = createOpinion();
        const insertedOpinion = await opinionRepository.insert(opinion);
        insertedOpinion.tweetText = 'New tweet text';
        await opinionRepository.update(insertedOpinion);

        const updatedOpinion = await opinionRepository.getOne(insertedOpinion.id);

        assert.deepEqual(updatedOpinion, insertedOpinion);
    });

    it('Can upsert on tweet Id, new tweet inserted', async () => {
        const opinion = createOpinion();

        const upsertedOpinion = await opinionRepository.upsertOnTweetId(opinion);

        const retrievedOpinion = await opinionRepository.getOne(upsertedOpinion.id);
        assert.deepEqual(retrievedOpinion, opinion);
    });

    it('Can upsert on tweet Id, existing tweet updated', async () => {
        const opinion = createOpinion();

        const insertedOpinion = await opinionRepository.insert(opinion);
        insertedOpinion.tweetText = 'Some new text';

        await opinionRepository.upsertOnTweetId(insertedOpinion);

        const retrievedOpinion = await opinionRepository.getOne(insertedOpinion.id);
        assert.deepEqual(retrievedOpinion, insertedOpinion);
    });

    it('Can get sentiment average', async() => {
        const testOpinion1 = createOpinionForPolitician(60, 6.5);
        const testOpinion2 = createOpinionForPolitician(60, 9);

        await opinionRepository.insert(testOpinion1);
        await opinionRepository.insert(testOpinion2);

        const averageSentiment = await opinionRepository.getSentimentAverageForPolitician(60);
        assert.equal(averageSentiment, 7.75);
    });

    it('Can get sentiment average, nonexistent politician', async() => {
        const testOpinion1 = createOpinionForPolitician(62, 6.5);
        const testOpinion2 = createOpinionForPolitician(62, 9);

        await opinionRepository.insert(testOpinion1);
        await opinionRepository.insert(testOpinion2);

        const averageSentiment = await opinionRepository.getSentimentAverageForPolitician(999);
        assert.equal(averageSentiment, null);
    });
});
