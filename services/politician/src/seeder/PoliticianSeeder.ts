import { readFile } from 'fs';
import { promisify } from 'util';
import Seeder from './Seeder';
import PoliticianRepository from '../entity/repositories/PoliticianRepository';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import Politician from '../entity/Politician';

const readFileAsync = promisify(readFile);

@injectable()
class PoliticianSeeder implements Seeder {

    private readonly PoliticianRepository: PoliticianRepository;

    constructor(@inject(TYPES.PoliticianRepository) PoliticianRepository: PoliticianRepository) {
        this.PoliticianRepository = PoliticianRepository;
    }

    async seed(): Promise<void> {
        const fileContents = await readFileAsync(__dirname + '/../../data/senators.csv', 'utf8');
        const lines = fileContents.split('\n');

        let header = true;
        let i = 1;
        for (let line of lines) {
            if (header) {
                header = false;
                continue;
            }

            const Politician = PoliticianSeeder.convert(line, i);
            await this.PoliticianRepository.insert(Politician);
            i++;
        }
    }

    private static convert(line: string, index: number): Politician {
        const [name, party] = line.split(',');
        const politician = new Politician();
        politician.id = index;
        politician.name = name;
        politician.party = party;
        politician.sentiment = 0;

        return politician;
    }
}

export default PoliticianSeeder;