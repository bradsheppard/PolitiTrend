import { Container } from 'inversify';
import { TYPES } from './types';
import LegislatorRepository from './model/repositories/legislator-repository';
import LegislatorSqlRepository from './model/repositories/legislator-sql-repository';

const container = new Container();

const connectionString = 'localhost';

const legislatorRepository: LegislatorRepository = new LegislatorSqlRepository(connectionString);

container.bind<LegislatorRepository>(TYPES.LegislatorRepository).toConstantValue(legislatorRepository);

export { container };