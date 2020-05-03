import { readFile } from 'fs';
import { promisify } from 'util';
import { Injectable } from '@nestjs/common';
import { CreatePoliticianDto } from '../dto/create-politician.dto';
import Politician, { Role } from '../politicians.entity';

const readFileAsync = promisify(readFile);

@Injectable()
class PoliticianSeeder {

	static index: number = 1;

	static async getPoliticians(): Promise<Politician[]> {
		const sentators = await PoliticianSeeder.processFile(__dirname + '/../../../data/senators.csv', Role.SENATOR);
		const presidents = await PoliticianSeeder.processFile(__dirname + '/../../../data/presidents.csv', Role.PRESIDENT);
		const presidentialsCandidates = await PoliticianSeeder.processFile(__dirname + '/../../../data/presidential_candidates.csv', Role.PRESIDENTIAL_CANDIDATE);

		return [...presidents, ...presidentialsCandidates, ...sentators];
	}

	private static async processFile(file: string, role: Role): Promise<Politician[]> {
		const fileContents = await readFileAsync(file, 'utf8');
		const lines = fileContents.split('\n');

		let header = true;
		const results = [];

		for (const line of lines) {
			if (header) {
				header = false;
				continue;
			}

			const politician = PoliticianSeeder.convert(line, PoliticianSeeder.index, role);

			if(!politician.name)
				continue;

			results.push(politician);
			PoliticianSeeder.index++;
		}

		return results
	}

	private static convert(line: string, index: number, role: Role): CreatePoliticianDto {
		const [name, party] = line.split(',');
		return {
			id: index,
			name,
			party,
			role
		};
	}
}

export default PoliticianSeeder;
