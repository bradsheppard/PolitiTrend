import OpinionRepository from './OpinionRepository';
import { inject, injectable } from 'inversify';
import Opinion from '../Opinion';
import { TYPES } from '../../types';
import ConnectionProvider from './ConnectionProvider';
import { Connection } from 'typeorm';

@injectable()
class OpinionSqlRepository implements OpinionRepository {

    private readonly connectionProvider: ConnectionProvider;
    private connection: Connection;

    constructor(@inject(TYPES.ConnectionProvider) connectionProvider: ConnectionProvider) {
        this.connectionProvider = connectionProvider;
    }

    private async getConnection(): Promise<Connection> {
        if (this.connection)
            return this.connection;

        this.connection = await this.connectionProvider();
        return this.connection;
    }

    async delete(id: number): Promise<boolean> {
        const connection = await this.getConnection();
        const repository = connection.getRepository(Opinion);

        const politician = await repository.findOne(id.toString());

        if (!politician)
            return false;

        await repository.remove(politician);

        return true;
    }

    async get(predicate?: {}): Promise<Opinion[]> {
        const connection = await this.getConnection();
        const repository = connection.getRepository(Opinion);

        if (predicate)
            return await repository.find(predicate);
        return await repository.find();
    }

    async getOne(id: number): Promise<Opinion> {
        const connection = await this.getConnection();
        const repository = connection.getRepository(Opinion);

        const politician = await repository.findOne(id);

        return politician != undefined ? politician : null;
    }

    async insert(entity: Opinion): Promise<Opinion> {
        const connection = await this.getConnection();
        const repository = connection.getRepository(Opinion);

        return await repository.save(entity);
    }

    async update(entity: Opinion): Promise<boolean> {
        const connection = await this.getConnection();
        const repository = connection.getRepository(Opinion);

        const politician = repository.findOne(entity.id);

        if (!politician)
            return false;

        await repository.save(entity);
        return true;
    }

}

export default OpinionSqlRepository;