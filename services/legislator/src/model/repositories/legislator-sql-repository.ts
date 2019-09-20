import LegislatorRepository from './legislator-repository';
import Legislator from '../legislator';
import { Sequelize } from 'sequelize-typescript';
import { injectable } from 'inversify';

@injectable()
class LegislatorSqlRepository implements LegislatorRepository {

    private readonly sequelize: Sequelize;

    constructor(connectionString: string) {
        this.sequelize = new Sequelize({
            host: connectionString,
            dialect: 'postgres',
            username: 'brad',
            password: 'pass123',
            database: 'legislator',
            port: 5432,
            models: [Legislator]
        });

        this.sequelize.sync();
    }

    async delete(id: number): Promise<boolean> {
        return await Legislator.destroy({where: { id }}) > 0
    }

    async get(predicate: {}): Promise<Legislator[]> {
        return Legislator.findAll({where: predicate});
    }

    async insert(entity: Legislator): Promise<void> {
        const legislator = new Legislator(entity);
        await legislator.save();
    }

    async update(entity: Legislator): Promise<boolean> {
        const legislator: Legislator | null = await Legislator.findOne({where: {id: entity.id}});

        if (!legislator)
            return false;

        legislator.update(entity);
        return true;
    }
}

export default LegislatorSqlRepository;