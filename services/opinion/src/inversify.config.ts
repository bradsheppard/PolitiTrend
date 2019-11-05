import 'reflect-metadata';
import { Container } from 'inversify';
import { createConnection } from 'typeorm';
import OpinionRepository from './entity/repositories/OpinionRepository';
import OpinionSqlRepository from './entity/repositories/OpinionSqlRepository';
import ConnectionProvider from './entity/repositories/ConnectionProvider';
import { TYPES } from './types';

const container = new Container();

const connectionProvider: ConnectionProvider = () => createConnection();

container.bind<ConnectionProvider>(TYPES.ConnectionProvider).toConstantValue(connectionProvider);
container.bind<OpinionRepository>(TYPES.OpinionRepository).to(OpinionSqlRepository);

export { container }