import { readFile } from 'fs';
import { promisify } from 'util';
import { Injectable } from '@nestjs/common';
import { CreatePoliticianDto } from '../dto/create-politician.dto';
import Politician, { Role } from '../politicians.entity';
import { PoliticiansService } from '../politicians.service';

const readFileAsync = promisify(readFile);

@Injectable()
class PoliticianSeeder {
	constructor(private politicianService: PoliticiansService) {}

	async updatePoliticianList(newPoliticians: CreatePoliticianDto[]) {
		const currentPoliticians = await this.politicianService.get({});

		for (const newPolitician of newPoliticians) {
			const matchingPolitician = currentPoliticians.find(
				x => x.name === newPolitician.name,
			);

			if (matchingPolitician) {
				await this.politicianService.update(
					matchingPolitician.id,
					newPolitician,
				);
			} else {
				await this.politicianService.insert(newPolitician);
			}
		}

		for (const currentPolitician of currentPoliticians) {
			const matchingPolitician = newPoliticians.find(
				x => x.name === currentPolitician.name,
			);

			if (!matchingPolitician) {
				currentPolitician.active = false;
				await this.politicianService.update(
					currentPolitician.id,
					currentPolitician,
				);
			}
		}
	}

	static async getPoliticiansFromDataFiles(): Promise<Politician[]> {
		const sentators = await PoliticianSeeder.processFile(
			__dirname + '/../../../data/senators.csv',
			Role.SENATOR,
		);
		const presidents = await PoliticianSeeder.processFile(
			__dirname + '/../../../data/presidents.csv',
			Role.PRESIDENT,
		);
		const presidentialsCandidates = await PoliticianSeeder.processFile(
			__dirname + '/../../../data/presidential_candidates.csv',
			Role.PRESIDENTIAL_CANDIDATE,
		);

		return [...sentators, ...presidents, ...presidentialsCandidates];
	}

	private static async processFile(
		file: string,
		role: Role,
	): Promise<Politician[]> {
		const fileContents = await readFileAsync(file, 'utf8');
		const lines = fileContents.split('\n');

		let header = true;
		const results = [];

		for (const line of lines) {
			if (header) {
				header = false;
				continue;
			}

			const politician = PoliticianSeeder.convert(line, role);

			if (!politician.name) {
				continue;
			}

			results.push(politician);
		}

		return results;
	}

	private static convert(line: string, role: Role): CreatePoliticianDto {
		const [name, party] = line.split(',');
		return {
			name,
			party,
			role,
		};
	}
}

export default PoliticianSeeder;
