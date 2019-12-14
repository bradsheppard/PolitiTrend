import ConnectionProvider from './ConnectionProvider';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import OpinionSummary from '../OpinionSummary';
import OpinionSummaryRepository from './OpinionSummaryRepository';

@injectable()
class OpinionSummarySqlRepository implements OpinionSummaryRepository {
    private readonly connectionProvider: ConnectionProvider;

    constructor(@inject(TYPES.ConnectionProvider) connectionProvider: ConnectionProvider) {
        this.connectionProvider = connectionProvider;
    }

    async deleteOne(id: number): Promise<boolean> {
        const connection = await this.connectionProvider.getConnection();
        const repository = connection.getRepository(OpinionSummary);

        const opinionSummary = await repository.findOne(id.toString());

        if (!opinionSummary)
            return false;

        await repository.remove(opinionSummary);

        return true;
    }

    async delete(): Promise<void> {
        const connection = await this.connectionProvider.getConnection();
        const repository = connection.getRepository(OpinionSummary);

        await repository.clear();
    }

    async get(predicate?: {}): Promise<OpinionSummary[]> {
        const connection = await this.connectionProvider.getConnection();
        const repository = connection.getRepository(OpinionSummary);

        if (predicate)
            return await repository.find(predicate);
        return await repository.find();
    }

    async getOne(id: number): Promise<OpinionSummary> {
        const connection = await this.connectionProvider.getConnection();
        const repository = connection.getRepository(OpinionSummary);

        const opinionSummary = await repository.findOne(id);

        return opinionSummary != undefined ? opinionSummary : null;
    }

    async insert(entity: OpinionSummary): Promise<OpinionSummary> {
        const connection = await this.connectionProvider.getConnection();
        const repository = connection.getRepository(OpinionSummary);

        return await repository.save(entity);
    }

    async update(entity: OpinionSummary): Promise<boolean> {
        const connection = await this.connectionProvider.getConnection();
        const repository = connection.getRepository(OpinionSummary);

        const opinionSummary = repository.findOne(entity.id);

        if (!opinionSummary)
            return false;

        await repository.save(entity);
        return true;
    }
}

export default OpinionSummarySqlRepository;
