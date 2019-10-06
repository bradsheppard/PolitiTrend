import { readFile } from 'fs';
import { promisify } from 'util';
import Seeder from './Seeder';
import LegislatorRepository from '../entity/repositories/LegislatorRepository';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import Legislator from '../entity/Legislator';

const readFileAsync = promisify(readFile);

@injectable()
class SenatorSeeder implements Seeder {

    private readonly legislatorRepository: LegislatorRepository;

    constructor(@inject(TYPES.LegislatorRepository) legislatorRepository: LegislatorRepository) {
        this.legislatorRepository = legislatorRepository;
    }

    async seed(): Promise<void> {
        const fileContents = await readFileAsync(__dirname + '/../../data/senators.csv', 'utf8');
        const lines = fileContents.split('\n');

        let header = true;
        for (let line of lines) {
            if (header) {
                header = false;
                continue;
            }

            const legislator = SenatorSeeder.convert(line);
            await this.legislatorRepository.insert(legislator);
        }
    }

    private static convert(line: string): Legislator {
        const [name, party] = line.split(',');
        const legislator = new Legislator();
        legislator.name = name;
        legislator.party = party;

        return legislator;
    }
}

export default SenatorSeeder;