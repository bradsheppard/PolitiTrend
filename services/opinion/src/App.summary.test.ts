import { container } from './inversify.config';
import App from './App';
import OpinionSummaryRepository from './entity/repositories/OpinionSummaryRepository';
import { TYPES } from './types';
import OpinionSummary from './entity/OpinionSummary';
import { agent } from 'supertest';
import { assert } from 'chai';

describe('Opinion summary API tests', () => {

    let app: App;
    let opinionSummaryRepository: OpinionSummaryRepository;

    let id = 1;

    function createOpinionSummary() {
        id++;
        return <OpinionSummary> {
            politician: id,
            sentiment: id
        };
    }

    const testOpinionSummary1 = createOpinionSummary();
    const testOpinionSummary2 = createOpinionSummary();

    before(async () => {
        app = container.get<App>(TYPES.App);
        opinionSummaryRepository = container.get<OpinionSummaryRepository>(TYPES.OpinionSummaryRepository);
        await opinionSummaryRepository.delete();

        await opinionSummaryRepository.insert(testOpinionSummary1);
        await opinionSummaryRepository.insert(testOpinionSummary2);
    });

    it('Can get all Opinion Summaries', async () => {
        const res = await agent(app.app).get('/summary');
        const opinionSummarys: Array<OpinionSummary> = res.body;

        assert.equal(res.status, 200);
        assert.includeDeepMembers(opinionSummarys, [testOpinionSummary1, testOpinionSummary2]);
    });

    it('Can get Opinion Summary', async () => {
        const res = await agent(app.app).get(`/summary/${testOpinionSummary1.id}`);
        const opinionSummary: OpinionSummary = res.body;

        assert.equal(res.status, 200);
        assert.deepEqual(opinionSummary, testOpinionSummary1);
    });
});
