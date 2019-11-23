import PoliticianRepository from './PoliticianRepository';
import Politician from '../../entity/Politician';
import { inject, injectable } from 'inversify';
import { Connection } from 'typeorm';
import ConnectionProvider from './ConnectionProvider';
import { TYPES } from '../../types';

@injectable()
class PoliticianSqlRepository implements PoliticianRepository {

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

    async deleteOne(id: number): Promise<boolean> {
        const connection = await this.getConnection();
        const repository = connection.getRepository(Politician);

        const politician = await repository.findOne(id.toString());

        if (!politician)
            return false;

        await repository.remove(politician);

        return true;
    }

    async delete(): Promise<void> {
        const connection = await this.getConnection();
        const repository = connection.getRepository(Politician);

        await repository.delete({});
    }

    async get(predicate?: {}): Promise<Politician[]> {
        const connection = await this.getConnection();
        const repository = connection.getRepository(Politician);

        if (predicate)
            return await repository.find(predicate);
        return await repository.find();
    }

    async getOne(id: number): Promise<Politician | null> {
        const connection = await this.getConnection();
        const repository = connection.getRepository(Politician);

        const politician = await repository.findOne(id);

        return politician != undefined ? politician : null;
    }

    async insert(entity: Politician): Promise<Politician> {
        const connection = await this.getConnection();
        const repository = connection.getRepository(Politician);

        return await repository.save(entity);
    }

    async update(entity: Politician): Promise<boolean> {
        const connection = await this.getConnection();
        const repository = connection.getRepository(Politician);

        const politician = repository.findOne(entity.id);

        if (!politician)
            return false;

        await repository.save(entity);
        return true;
    }
}

export default PoliticianSqlRepository;