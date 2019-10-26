import { container } from './inversify.config';
import App from './App';
import { TYPES } from './types';

const app: App = container.get<App>(TYPES.App);

app.start();
