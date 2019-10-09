import { container } from './inversify.config';
import SeedExecuter from './seeder/SeedExecuter';
import { TYPES } from './types';

const seeder: SeedExecuter = container.get<SeedExecuter>(TYPES.SeedExecuter);

(async() => {
    await seeder.execute();
})();