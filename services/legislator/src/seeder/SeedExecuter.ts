import Seeder from './Seeder';
import { injectable, multiInject } from 'inversify';
import { TYPES } from '../types';

@injectable()
class SeedExecuter {

    private readonly seeders: Array<Seeder>;

    constructor(@multiInject(TYPES.Seeder) seeders: Array<Seeder>) {
        this.seeders = seeders;
    }

    async execute(): Promise<void> {
        for (let seeder of this.seeders) {
            await seeder.seed();
        }
    }
}

export default SeedExecuter;
