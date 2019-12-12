import JobRepository from './JobRepository';
import Job from '../Job';
import ConnectionProvider from './ConnectionProvider';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';

@injectable()
class JobSqlRepository implements JobRepository {

    private readonly connectionProvider: ConnectionProvider;

    constructor(@inject(TYPES.ConnectionProvider) connectionProvider: ConnectionProvider) {
        this.connectionProvider = connectionProvider;
    }

    async deleteOne(id: number): Promise<boolean> {
        const connection = await this.connectionProvider.getConnection();
        const repository = connection.getRepository(Job);

        const opinion = await repository.findOne(id.toString());

        if (!opinion)
            return false;

        await repository.remove(opinion);

        return true;
    }

    async delete(): Promise<void> {
        const connection = await this.connectionProvider.getConnection();
        const repository = connection.getRepository(Job);

        await repository.clear();
    }

    async get(predicate?: {}): Promise<Job[]> {
        const connection = await this.connectionProvider.getConnection();
        const repository = connection.getRepository(Job);

        if (predicate)
            return await repository.find(predicate);
        return await repository.find();
    }

    async getOne(id: number): Promise<Job> {
        const connection = await this.connectionProvider.getConnection();
        const repository = connection.getRepository(Job);

        const opinion = await repository.findOne(id);

        return opinion != undefined ? opinion : null;
    }

    async insert(entity: Job): Promise<Job> {
        const connection = await this.connectionProvider.getConnection();
        const repository = connection.getRepository(Job);

        return await repository.save(entity);
    }

    async update(entity: Job): Promise<boolean> {
        const connection = await this.connectionProvider.getConnection();
        const repository = connection.getRepository(Job);

        const opinion = repository.findOne(entity.id);

        if (!opinion)
            return false;

        await repository.save(entity);
        return true;
    }
}

export default JobSqlRepository