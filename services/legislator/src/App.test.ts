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

        await agent(app.app).post('/').send(testLegislator);
    });

    it('Can get all legislators', async () => {
        const res = await agent(app.app).get('/');

        assert.equal(res.status, 200);
    });
});