import { container } from './inversify.config';
import { assert } from 'chai';
import { agent } from 'supertest';
import { TYPES } from './types';
import App from './App';
import Opinion from './entity/Opinion';

describe('App tests', () => {

    let app: App;
    let testOpinion: Opinion;
    let testOpinion2: Opinion;

    before(async () => {
        app = container.get<App>(TYPES.App);

        testOpinion = new Opinion();
        testOpinion.tweetId = '1';
        testOpinion.tweetText = 'test text 1';
        testOpinion.sentiment = 11;
        testOpinion.politician = 111;

        testOpinion2 = new Opinion();
        testOpinion2.tweetId = '2';
        testOpinion2.tweetText = 'test text 2';
        testOpinion2.sentiment = 22;
        testOpinion2.politician = 222;

        const res = await agent(app.app).post('/').send(testOpinion);
        testOpinion = res.body;
    });

    it('Can ping', async () => {
        const res = await agent(app.app).get('/ping');

        assert.equal(res.status, 200);
    });

    it('Can get all Opinions', async () => {
        const res = await agent(app.app).get('/');
        const opinions: Array<Opinion> = res.body;

        assert.equal(res.status, 200);
        assert.includeDeepMembers(opinions, [testOpinion]);
    });

    it('Can get Opinions by politician', async() => {
        const res = await agent(app.app).get('/?politician=111');
        const opinions: Array<Opinion> = res.body;

        assert.equal(res.status, 200);

        for(let opinion of opinions) {
            assert.equal(opinion.politician, 111);
        }
    });

    it('Can insert Opinion', async () => {
        const newOpinion: Opinion = new Opinion();
        newOpinion.tweetId = '2';
        newOpinion.tweetText = 'test text 2';
        newOpinion.sentiment = 22;
        newOpinion.politician = 222;

        let res = await agent(app.app).post('/').send(newOpinion);
        const opinion: Opinion = res.body;
        newOpinion.id = opinion.id;

        res = await agent(app.app).get(`/${opinion.id}`);
        const insertedOpinion: Opinion = res.body;

        assert.deepEqual(insertedOpinion, newOpinion);
    });

    it('Can delete existing Opinion', async () => {
        let newOpinion: Opinion = new Opinion();
        newOpinion.tweetId = '3';
        newOpinion.tweetText = 'test text 3';
        newOpinion.sentiment = 33;
        newOpinion.politician = 333;

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