import { container } from './inversify.config';
import App from './App';
import { TYPES } from './types';
import SeedExecuter from './seeder/SeedExecuter';

const seedExecuter: SeedExecuter = container.get<SeedExecuter>(TYPES.SeedExecuter);
const app: App = container.get<App>(TYPES.App);

(async () => {
    console.log('Seeding database...');
    await seedExecuter.execute();
    console.log('Done seeding');

    app.start();
})();
