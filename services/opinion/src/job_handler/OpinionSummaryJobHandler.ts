import JobHandler from './JobHandler';
import OpinionSummaryJob from '../entity/OpinionSummaryJob';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import OpinionRepository from '../entity/repositories/OpinionRepository';
import OpinionSummaryRepository from '../entity/repositories/OpinionSummaryRepository';
import OpinionSummary from '../entity/OpinionSummary';

@injectable()
class OpinionSummaryJobHandler implements JobHandler<OpinionSummaryJob> {

    private readonly opinionRepository: OpinionRepository;
    private readonly opinionSummaryRepository: OpinionSummaryRepository;

    constructor(
        @inject(TYPES.OpinionRepository) opinionRepostory,
        @inject(TYPES.OpinionSummaryRepository) opinionSummaryRepository)
    {
        this.opinionRepository = opinionRepostory;
        this.opinionSummaryRepository = opinionSummaryRepository;
    }

    async handle(job: OpinionSummaryJob): Promise<void> {
        const sentiment = await this.opinionRepository.getSentimentAverageForPolitician(job.politician);
        const opinionSummary: OpinionSummary = <OpinionSummary> {
            sentiment,
            politician: job.politician
        };
        await this.opinionSummaryRepository.insert(opinionSummary);
    }
}

export default OpinionSummaryJobHandler;
