import { container } from './inversify.config';
import { assert } from 'chai';
import { agent } from 'supertest';
import { TYPES } from './types';
import App from './App';
import Legislator from './entity/Legislator';

describe('App tests', () => {

    let app: App;
    let testLegislator: Legislator;

    before(async () => {
        app = container.get<App>(TYPES.App);

        testLegislator = new Legislator();
        testLegislator.firstName = 'bob';
        testLegislator.lastName = 'smith';
        testLegislator.age = 50;

        const res = await agent(app.app).post('/').send(testLegislator);
        testLegislator = res.body;
    });

    it('Can ping', async () => {
        const res = await agent(app.app).get('/ping');

        assert.equal(res.status, 200);
    });

    it('Can get all legislators', async () => {
        const res = await agent(app.app).get('/');
        const legislators: Array<Legislator> = res.body;

        assert.equal(res.status, 200);
        assert.includeDeepMembers(legislators, [testLegislator]);
    });

    it('Can insert legislator', async () => {
        const newLegislator: Legislator = new Legislator();
        newLegislator.age = 20;
        newLegislator.firstName = 'john';
        newLegislator.lastName = 'anderson';

        let res = await agent(app.app).post('/').send(newLegislator);
        const legislator: Legislator = res.body;
        newLegislator.id = legislator.id;

        res = await agent(app.app).get(`/${legislator.id}`);
        const insertedLegislator: Legislator = res.body;

        assert.deepEqual(insertedLegislator, newLegislator);
    });

    it('Can delete existing legislator', async () => {
        let newLegislator: Legislator = new Legislator();
        newLegislator.age = 32;
        newLegislator.firstName = 'Steve';
        newLegislator.lastName = 'Xiao';

        let res = await agent(app.app).post('/').send(newLegislator);
        newLegislator = res.body;

        res = await agent(app.app).delete(`/${newLegislator.id}`);

        assert.equal(res.status, 200);
    });

    it('Cant delete nonexisting legislator', async () => {
        const res = await agent(app.app).delete('/9999');

        assert.equal(res.status, 404);
    });
});