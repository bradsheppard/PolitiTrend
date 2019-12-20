import OpinionSummary from '../../entity/OpinionSummary';
import OpinionSummaryRepository from './OpinionSummaryRepository';
import { container } from '../../inversify.config';
import { TYPES } from '../../types';
import * as assert from 'assert';

describe('OpinionSummary repository tests', () => {

    let opinionSummaryRepository: OpinionSummaryRepository;

    let id = 0;

    function createOpinionSummary() {
        id++;
        return <OpinionSummary> {
            sentiment: id + 0.25,
            politician: id
        };
    }

    before(async () => {
        opinionSummaryRepository = container.get<OpinionSummaryRepository>(TYPES.OpinionSummaryRepository);
        await opinionSummaryRepository.delete();
    });

    it('Can get all', async () => {
        const opinionSummary1 = createOpinionSummary();
        const opinionSummary2 = createOpinionSummary();

        const firstInsert = await opinionSummaryRepository.insert(opinionSummary1);
        const secondInsert = await opinionSummaryRepository.insert(opinionSummary2);

        const OpinionSummarys = await opinionSummaryRepository.get({});

        assert.deepEqual(OpinionSummarys, [firstInsert, secondInsert]);
    });

    it('Can get', async() => {
        const opinionSummary = createOpinionSummary();
        const insertedOpinionSummary = await opinionSummaryRepository.insert(opinionSummary);
        opinionSummary.id = insertedOpinionSummary.id;

        const retrievedOpinionSummary = await opinionSummaryRepository.getOne(insertedOpinionSummary.id);
        assert.deepEqual(retrievedOpinionSummary, opinionSummary);
        assert.deepEqual(insertedOpinionSummary, retrievedOpinionSummary);
    });

    it('Can get by politician', async() => {
        const opinionSummary = createOpinionSummary();
        const insertedOpinionSummary = await opinionSummaryRepository.insert(opinionSummary);

        const politicianOpinionSummarys = await opinionSummaryRepository.get({politician: insertedOpinionSummary.politician});

        for(let politician of politicianOpinionSummarys) {
            assert.equal(politician.politician, insertedOpinionSummary.politician);
        }
    });

    it('Can delete', async () => {
        const opinionSummary = createOpinionSummary();
        const insertedOpinionSummary = await opinionSummaryRepository.insert(opinionSummary);
        await opinionSummaryRepository.deleteOne(insertedOpinionSummary.id);

        const opinionSummarys: Array<OpinionSummary> = await opinionSummaryRepository.get({id: insertedOpinionSummary.id});

        assert.equal(opinionSummarys.length, 0);
    });

    it('Can update', async () => {
        const opinionSummary = createOpinionSummary();
        const insertedOpinionSummary = await opinionSummaryRepository.insert(opinionSummary);
        insertedOpinionSummary.politician += 1;
        await opinionSummaryRepository.update(insertedOpinionSummary);

        const updatedOpinionSummary = await opinionSummaryRepository.getOne(insertedOpinionSummary.id);

        assert.deepEqual(updatedOpinionSummary, insertedOpinionSummary);
    });
});
