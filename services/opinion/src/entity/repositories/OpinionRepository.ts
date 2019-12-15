import Opinion from '../../entity/Opinion';
import Repository from './Repository';

interface OpinionRepository extends Repository<Opinion> {
    upsertOnTweetId(opinion: Opinion): Promise<Opinion>;
    getSentimentAverageForPolitician(politicianId: number): Promise<number>;
}

export default OpinionRepository;
