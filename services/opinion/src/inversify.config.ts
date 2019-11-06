import 'reflect-metadata';
import { Container } from 'inversify';
import OpinionRepository from './entity/repositories/OpinionRepository';
import OpinionSqlRepository from './entity/repositories/OpinionSqlRepository';
import { TYPES } from './types';
import Controller from './controllers/Controller';
import OpinionController from './controllers/OpinionController';
import App from './App';
import ConnectionProvider from './entity/repositories/ConnectionProvider';

const container = new Container();

const connectionProvider: ConnectionProvider = new ConnectionProvider();

container.bind<ConnectionProvider>(TYPES.ConnectionProvider).toConstantValue(connectionProvider);
container.bind<OpinionRepository>(TYPES.OpinionRepository).to(OpinionSqlRepository);
container.bind<Controller>(TYPES.Controller).to(OpinionController);
container.bind<App>(TYPES.App).to(App);

export { container }