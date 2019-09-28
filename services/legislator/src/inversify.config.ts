import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import LegislatorRepository from './entity/repositories/LegislatorRepository';
import LegislatorSqlRepository from './entity/repositories/LegislatorSqlRepository';
import { createConnection } from 'typeorm';
import ConnectionProvider from './entity/repositories/ConnectionProvider';
import LegislatorController from './controllers/LegislatorController';
import App from './App';
import Controller from './controllers/Controller';

const container = new Container();

const connectionProvider: ConnectionProvider = () => createConnection();

const legislatorRepository: LegislatorRepository = new LegislatorSqlRepository(connectionProvider);

container.bind<LegislatorRepository>(TYPES.LegislatorRepository).toConstantValue(legislatorRepository);

container.bind<Controller>(TYPES.Controller).to(LegislatorController);

container.bind<App>(TYPES.App).to(App);

export { container };