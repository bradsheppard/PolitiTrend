import LegislatorRepository from './LegislatorRepository';
import Legislator from '../../entity/Legislator';
import { inject, injectable } from 'inversify';
import { Connection } from 'typeorm';
import ConnectionProvider from './ConnectionProvider';
import { TYPES } from '../../types';

@injectable()
class LegislatorSqlRepository implements LegislatorRepository {

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
        const legislator = await connection.manager.findOne(id.toString());

        if (!legislator)
            return false;

        await this.connection.manager.remove(legislator);

        return true;
    }

    async get(predicate?: {}): Promise<Legislator[]> {
        const connection = await this.getConnection();
        const repository = connection.getRepository(Legislator);

        if (predicate)
            return await repository.find(predicate);
        return await repository.find();
    }

    async insert(entity: Legislator): Promise<void> {
        const connection = await this.getConnection();
        const repository = connection.getRepository(Legislator);

        await repository.save(entity);
    }

    async update(entity: Legislator): Promise<boolean> {
        const connection = await this.getConnection();
        const repository = connection.getRepository(Legislator);

        const legislator = repository.findOne(entity.id);

        if (!legislator)
            return false;

        await repository.save(entity);
        return true;
    }
}

export default LegislatorSqlRepository;