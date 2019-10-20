import { container } from './inversify.config';
import { assert } from 'chai';
import { agent } from 'supertest';
import { TYPES } from './types';
import App from './App';
import Politician from './entity/Politician';

describe('App tests', () => {

    let app: App;
    let testPolitician: Politician;

    before(async () => {
        app = container.get<App>(TYPES.App);

        testPolitician = new Politician();
        testPolitician.name = 'bob smith';
        testPolitician.party = 'Democratic';
        testPolitician.sentiment = 1;

        const res = await agent(app.app).post('/').send(testPolitician);
        testPolitician = res.body;
    });

    it('Can ping', async () => {
        const res = await agent(app.app).get('/ping');

        assert.equal(res.status, 200);
    });

    it('Can get all Politicians', async () => {
        const res = await agent(app.app).get('/');
        const politicians: Array<Politician> = res.body;

        assert.equal(res.status, 200);
        assert.includeDeepMembers(politicians, [testPolitician]);
    });

    it('Can insert Politician', async () => {
        const newPolitician: Politician = new Politician();
        newPolitician.party = 'Republican';
        newPolitician.name = 'john anderson';
        newPolitician.sentiment = 2;

        let res = await agent(app.app).post('/').send(newPolitician);
        const politician: Politician = res.body;
        newPolitician.id = politician.id;

        res = await agent(app.app).get(`/${politician.id}`);
        const insertedPolitician: Politician = res.body;

        assert.deepEqual(insertedPolitician, newPolitician);
    });

    it('Can delete existing Politician', async () => {
        let newPolitician: Politician = new Politician();
        newPolitician.party = 'Democratic';
        newPolitician.name = 'Steve Xiao';
        newPolitician.sentiment = 3;

        let res = await agent(app.app).post('/').send(newPolitician);
        newPolitician = res.body;

        res = await agent(app.app).delete(`/${newPolitician.id}`);

        assert.equal(res.status, 200);
    });

    it('Cant delete nonexisting Politician', async () => {
        const res = await agent(app.app).delete('/9999');

        assert.equal(res.status, 404);
    });
});