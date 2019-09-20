import { Container } from 'inversify';
import { TYPES } from './types';
import LegislatorRepository from './entity/repositories/LegislatorRepository';
import LegislatorSqlRepository from './entity/repositories/LegislatorSqlRepository';
import { Connection, createConnection } from 'typeorm';
import ConnectionProvider from './entity/repositories/ConnectionProvider';

const container = new Container();

const connectionProvider: ConnectionProvider = () => createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'brad',
    password: 'pass123',
    database: 'legislator',
    entities: [__dirname + '/entity/*.ts'],
    synchronize: true
});

const legislatorRepository: LegislatorRepository = new LegislatorSqlRepository(connectionProvider);

container.bind<LegislatorRepository>(TYPES.LegislatorRepository).toConstantValue(legislatorRepository);

export { container };