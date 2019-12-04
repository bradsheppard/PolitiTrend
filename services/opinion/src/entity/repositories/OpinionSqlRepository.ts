import OpinionRepository from './OpinionRepository';
import { inject, injectable } from 'inversify';
import Opinion from '../Opinion';
import { TYPES } from '../../types';
import ConnectionProvider from './ConnectionProvider';
import { InsertResult } from 'typeorm';

@injectable()
class OpinionSqlRepository implements OpinionRepository {

    private readonly connectionProvider: ConnectionProvider;

    constructor(@inject(TYPES.ConnectionProvider) connectionProvider: ConnectionProvider) {
        this.connectionProvider = connectionProvider;
    }

    async deleteOne(id: number): Promise<boolean> {
        const connection = await this.connectionProvider.getConnection();
        const repository = connection.getRepository(Opinion);

        const opinion = await repository.findOne(id.toString());

        if (!opinion)
            return false;

        await repository.remove(opinion);

        return true;
    }

    async delete(): Promise<void> {
        const connection = await this.connectionProvider.getConnection();
        const repository = connection.getRepository(Opinion);

        await repository.clear();
    }

    async get(predicate?: {}): Promise<Opinion[]> {
        const connection = await this.connectionProvider.getConnection();
        const repository = connection.getRepository(Opinion);

        if (predicate)
            return await repository.find(predicate);
        return await repository.find();
    }

    async getOne(id: number): Promise<Opinion> {
        const connection = await this.connectionProvider.getConnection();
        const repository = connection.getRepository(Opinion);

        const opinion = await repository.findOne(id);

        return opinion != undefined ? opinion : null;
    }

    async insert(entity: Opinion): Promise<Opinion> {
        const connection = await this.connectionProvider.getConnection();
        const repository = connection.getRepository(Opinion);

        return await repository.save(entity);
    }

    async update(entity: Opinion): Promise<boolean> {
        const connection = await this.connectionProvider.getConnection();
        const repository = connection.getRepository(Opinion);

        const opinion = repository.findOne(entity.id);

        if (!opinion)
            return false;

        await repository.save(entity);
        return true;
    }

    async upsertOnTweetId(opinion: Opinion): Promise<Opinion> {
        const connection = await this.connectionProvider.getConnection();

        const insertResult: InsertResult = await connection.createQueryBuilder()
            .insert()
            .into(Opinion)
            .values(opinion)
            .onConflict(`("tweetId") DO UPDATE SET "tweetText" = :tweetText`)
            .setParameter('tweetText', opinion.tweetText)
            .execute();

        let insertedOpinion = Object.assign({}, opinion);
        insertedOpinion.id = insertResult.identifiers[0].id;

        return insertedOpinion;
    }

}

export default OpinionSqlRepository;