import 'reflect-metadata';
import { Container } from 'inversify';
import OpinionRepository from './entity/repositories/OpinionRepository';
import OpinionSqlRepository from './entity/repositories/OpinionSqlRepository';
import { TYPES } from './types';
import Controller from './controllers/Controller';
import OpinionController from './controllers/OpinionController';
import App from './App';
import ConnectionProvider from './entity/repositories/ConnectionProvider';
import KafkaEventBus from './event_bus/KafkaEventBus';
import EventBus from './event_bus/EventBus';
import EventHandler from './event_bus/EventHandler';
import NewOpinionEventHandler from './event_bus/NewOpinionEventHandler';
import EventType from './event_bus/EventType';
import Opinion from './entity/Opinion';
import JobRepository from './entity/repositories/JobRepository';
import JobSqlRepository from './entity/repositories/JobSqlRepository';
import JobController from './controllers/JobController';
import OpinionSummaryController from './controllers/OpinionSummaryController';
import OpinionSummaryRepository from './entity/repositories/OpinionSummaryRepository';
import OpinionSummarySqlRepository from './entity/repositories/OpinionSummarySqlRepository';

const container = new Container();

container.bind<ConnectionProvider>(TYPES.ConnectionProvider).to(ConnectionProvider).inSingletonScope();

container.bind<EventBus>(TYPES.EventBus).to(KafkaEventBus);
container.bind<EventHandler<EventType.NewOpinion, Opinion>>(TYPES.EventHandler).to(NewOpinionEventHandler);

container.bind<OpinionRepository>(TYPES.OpinionRepository).to(OpinionSqlRepository);
container.bind<OpinionSummaryRepository>(TYPES.OpinionSummaryRepository).to(OpinionSummarySqlRepository);
container.bind<JobRepository>(TYPES.JobRepository).to(JobSqlRepository);

container.bind<Controller>(TYPES.Controller).to(OpinionController);
container.bind<Controller>(TYPES.Controller).to(OpinionSummaryController);
container.bind<Controller>(TYPES.Controller).to(JobController);

container.bind<App>(TYPES.App).to(App);

export { container }
