import JobHandler from './JobHandler';
import OpinionSummaryJob, { JobStatus } from '../entity/OpinionSummaryJob';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import OpinionRepository from '../entity/repositories/OpinionRepository';
import OpinionSummaryRepository from '../entity/repositories/OpinionSummaryRepository';
import OpinionSummary from '../entity/OpinionSummary';
import OpinionSummaryJobRepository from '../entity/repositories/OpinionSummaryJobRepository';

@injectable()
class OpinionSummaryJobHandler implements JobHandler<OpinionSummaryJob> {

    private readonly opinionRepository: OpinionRepository;
    private readonly opinionSummaryRepository: OpinionSummaryRepository;
    private readonly opinionSummaryJobRepository: OpinionSummaryJobRepository;

    constructor(
        @inject(TYPES.OpinionRepository) opinionRepostory,
        @inject(TYPES.OpinionSummaryRepository) opinionSummaryRepository,
        @inject(TYPES.OpinionSummaryJobRepository) opinionSummaryJobRepository)
    {
        this.opinionRepository = opinionRepostory;
        this.opinionSummaryRepository = opinionSummaryRepository;
        this.opinionSummaryJobRepository = opinionSummaryJobRepository;
    }

    async handle(job: OpinionSummaryJob): Promise<void> {
        const sentiment = await this.opinionRepository.getSentimentAverageForPolitician(job.politician);

        const opinionSummary: OpinionSummary = <OpinionSummary> {
            sentiment,
            politician: job.politician
        };

        const insertedOpinionSummary = await this.opinionSummaryRepository.insert(opinionSummary);
        job.status = JobStatus.Completed;
        job.opinionSummary = insertedOpinionSummary.id;
        await this.opinionSummaryJobRepository.update(job);
    }
}

export default OpinionSummaryJobHandler;
