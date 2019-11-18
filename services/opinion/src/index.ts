import { container } from './inversify.config';
import App from './App';
import { TYPES } from './types';
import EventBus from './event_bus/EventBus';

container.get<EventBus>(TYPES.EventBus);

const app: App = container.get<App>(TYPES.App);

app.start();
