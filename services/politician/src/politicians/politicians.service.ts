import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import Politician from './politicians.entity';
import { InjectRepository } from '@nestjs/typeorm';

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

	async insert(entity: Politician): Promise<Politician> {
		return await this.repository.save(entity);
	}
}
