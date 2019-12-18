import { container } from './inversify.config';
import { assert } from 'chai';
import { agent } from 'supertest';
import { TYPES } from './types';
import App from './App';
import Opinion from './entity/Opinion';
import OpinionRepository from './entity/repositories/OpinionRepository';

describe('Opinion API tests', () => {

    let app: App;
    let opinionRepository: OpinionRepository;

    let id = 1;

    function createOpinion() {
        id++;
        return <Opinion> {
            id,
            tweetText: `test text ${id}`,
            sentiment: id,
            tweetId: id.toString(),
            politician: id
        };
    }

    let testOpinion1 = createOpinion();
    let testOpinion2 = createOpinion();

    before(async () => {
        app = container.get<App>(TYPES.App);
        opinionRepository = container.get<OpinionRepository>(TYPES.OpinionRepository);
        await opinionRepository.delete();

        testOpinion1 = await opinionRepository.insert(testOpinion1);
        testOpinion2 = await opinionRepository.insert(testOpinion2);
    });

    it('Can ping', async () => {
        const res = await agent(app.app).get('/ping');

        assert.equal(res.status, 200);
    });

    it('Can get all Opinions', async () => {
        const res = await agent(app.app).get('/');
        const opinions: Array<Opinion> = res.body;

        assert.equal(res.status, 200);
        assert.includeDeepMembers(opinions, [testOpinion1]);
    });

    it('Can get Opinions by politician', async() => {
        const res = await agent(app.app).get(`/?politician=${testOpinion1.politician}`);
        const opinions: Array<Opinion> = res.body;

        assert.equal(res.status, 200);

        for(let opinion of opinions) {
            assert.equal(opinion.politician, testOpinion1.politician);
        }
    });

    it('Can insert Opinion', async () => {
        const newOpinion = createOpinion();

        let res = await agent(app.app).post('/').send(newOpinion);
        const opinion: Opinion = res.body;
        newOpinion.id = opinion.id;

        res = await agent(app.app).get(`/${opinion.id}`);
        const insertedOpinion: Opinion = res.body;

        assert.deepEqual(insertedOpinion, newOpinion);
    });

    it('Can delete existing Opinion', async () => {
        let newOpinion = createOpinion();

        let res = await agent(app.app).post('/').send(newOpinion);
        newOpinion = res.body;

        res = await agent(app.app).delete(`/${newOpinion.id}`);

        assert.equal(res.status, 200);
    });

    it('Cant delete nonexisting Opinion', async () => {
        const res = await agent(app.app).delete('/9999');

        assert.equal(res.status, 404);
    });
});
