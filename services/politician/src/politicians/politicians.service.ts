import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import Politician, { Role } from './politicians.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePoliticianDto } from './dto/create-politician.dto';

@Injectable()
export class PoliticiansService {

	constructor(
		@InjectRepository(Politician)
		private readonly repository: Repository<Politician>,
	) {}

	async get(predicate?: {}): Promise<Politician[]> {
		if (predicate) {
			return await this.repository.find(predicate);
		}
		return await this.repository.find();
	}

	async getOne(id: number): Promise<Politician | null> {
		const politician = await this.repository.findOne(id);

		return politician !== undefined ? politician : null;
	}

	async insert(createPoliticianDto: CreatePoliticianDto): Promise<Politician> {
		const politician: Politician = {
			id: createPoliticianDto.id,
			name: createPoliticianDto.name,
			party: createPoliticianDto.party,
			role: createPoliticianDto.role as Role
		};

		return await this.repository.save(politician);
	}

	async delete(): Promise<void> {
		await this.repository.delete({});
	}
}
