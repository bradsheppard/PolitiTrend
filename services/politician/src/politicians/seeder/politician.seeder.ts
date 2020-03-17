import { readFile } from 'fs';
import { promisify } from 'util';
import { Injectable } from '@nestjs/common';
import { CreatePoliticianDto } from '../dto/create-politician.dto';

const readFileAsync = promisify(readFile);

@Injectable()
class PoliticianSeeder {

	static async getPoliticians(): Promise<CreatePoliticianDto[]> {
		const fileContents = await readFileAsync(__dirname + '/../../../data/senators.csv', 'utf8');
		const lines = fileContents.split('\n');

		let header = true;
		let i = 1;
		const results = [];

		for (const line of lines) {
			if (header) {
				header = false;
				continue;
			}

			const politician = PoliticianSeeder.convert(line, i);
			results.push(politician);
			i++;
		}

		return results;
	}

	private static convert(line: string, index: number): CreatePoliticianDto {
		const [name, party] = line.split(',');
		return {
			id: index,
			name,
			party
		};
	}
}

export default PoliticianSeeder;
