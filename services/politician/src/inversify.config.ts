import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import PoliticianRepository from './entity/repositories/PoliticianRepository';
import PoliticianSqlRepository from './entity/repositories/PoliticianSqlRepository';
import { createConnection } from 'typeorm';
import ConnectionProvider from './entity/repositories/ConnectionProvider';
import PoliticianController from './controllers/PoliticianController';
import App from './App';
import Controller from './controllers/Controller';
import Seeder from './seeder/Seeder';
import PoliticianSeeder from './seeder/PoliticianSeeder';
import SeedExecuter from './seeder/SeedExecuter';

const container = new Container();

const connectionProvider: ConnectionProvider = () => createConnection();

const PoliticianRepository: PoliticianRepository = new PoliticianSqlRepository(connectionProvider);

container.bind<Seeder>(TYPES.Seeder).to(PoliticianSeeder);
container.bind<SeedExecuter>(TYPES.SeedExecuter).to(SeedExecuter);

container.bind<PoliticianRepository>(TYPES.PoliticianRepository).toConstantValue(PoliticianRepository);
container.bind<Controller>(TYPES.Controller).to(PoliticianController);
container.bind<App>(TYPES.App).to(App);

export { container };