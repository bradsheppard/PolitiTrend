import OpinionSummaryJobRepository from './OpinionSummaryJobRepository';
import ConnectionProvider from './ConnectionProvider';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import OpinionSummaryJob from '../OpinionSummaryJob';

@injectable()
class OpinionSummaryJobSqlRepository implements OpinionSummaryJobRepository {

    private readonly connectionProvider: ConnectionProvider;

    constructor(@inject(TYPES.ConnectionProvider) connectionProvider: ConnectionProvider) {
        this.connectionProvider = connectionProvider;
    }

    async deleteOne(id: number): Promise<boolean> {
        const connection = await this.connectionProvider.getConnection();
        const repository = connection.getRepository(OpinionSummaryJob);

        const opinion = await repository.findOne(id.toString());

        if (!opinion)
            return false;

        await repository.remove(opinion);

        return true;
    }

    async delete(): Promise<void> {
        const connection = await this.connectionProvider.getConnection();
        const repository = connection.getRepository(OpinionSummaryJob);

        await repository.clear();
    }

    async get(predicate?: {}): Promise<OpinionSummaryJob[]> {
        const connection = await this.connectionProvider.getConnection();
        const repository = connection.getRepository(OpinionSummaryJob);

        if (predicate)
            return await repository.find(predicate);
        return await repository.find();
    }

    async getOne(id: number): Promise<OpinionSummaryJob> {
        const connection = await this.connectionProvider.getConnection();
        const repository = connection.getRepository(OpinionSummaryJob);

        const opinion = await repository.findOne(id);

        return opinion != undefined ? opinion : null;
    }

    async insert(entity: OpinionSummaryJob): Promise<OpinionSummaryJob> {
        const connection = await this.connectionProvider.getConnection();
        const repository = connection.getRepository(OpinionSummaryJob);

        return await repository.save(repository.create(entity));
    }

    async update(entity: OpinionSummaryJob): Promise<boolean> {
        const connection = await this.connectionProvider.getConnection();
        const repository = connection.getRepository(OpinionSummaryJob);

        const opinion = repository.findOne(entity.id);

        if (!opinion)
            return false;

        await repository.save(entity);
        return true;
    }
}

export default OpinionSummaryJobSqlRepository
