import { readFile } from 'fs';
import { promisify } from 'util';
import Politician from '../politicians.entity';
import { PoliticiansService } from '../politicians.service';
import { Injectable } from '@nestjs/common';

const readFileAsync = promisify(readFile);

@Injectable()
class PoliticianSeeder {

	constructor(private politicianService: PoliticiansService) {}

	async seed(): Promise<void> {
		const fileContents = await readFileAsync(__dirname + '/../../../data/senators.csv', 'utf8');
		const lines = fileContents.split('\n');

		let header = true;
		let i = 1;
		for (const line of lines) {
			if (header) {
				header = false;
				continue;
			}

			const politician = PoliticianSeeder.convert(line, i);
			await this.politicianService.insert(politician);
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
