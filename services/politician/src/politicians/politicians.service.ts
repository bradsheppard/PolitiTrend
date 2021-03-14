import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import Politician from './politicians.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePoliticianDto } from './dto/create-politician.dto';
import { SearchPoliticianDto } from './dto/search-politician.dto';

@Injectable()
export class PoliticiansService {
	constructor(
		@InjectRepository(Politician)
		private readonly repository: Repository<Politician>,
	) {}

	async get(searchPoliticianDto: SearchPoliticianDto): Promise<Politician[]> {
		const searchParams: any = searchPoliticianDto;
		if (searchPoliticianDto.role) {
			searchParams.role = In(searchPoliticianDto.role);
		}

		return await this.repository.find({ where: searchParams });
	}

	async getOne(id: number): Promise<Politician | null> {
		const politician = await this.repository.findOne(id);

		return politician !== undefined ? politician : null;
	}

	async insert(
		createPoliticianDto: CreatePoliticianDto,
	): Promise<Politician> {
		const politician = this.repository.create(createPoliticianDto);

		return await this.repository.save(politician);
	}

	async update(
		id: number,
		createPoliticianDto: CreatePoliticianDto,
	): Promise<Politician | null> {
		await this.repository.update(
			id,
			this.repository.create(createPoliticianDto),
		);

		const updatedPolitician = await this.repository.findOne(id);
		return updatedPolitician !== undefined ? updatedPolitician : null;
	}

	async delete(): Promise<void> {
		await this.repository.delete({});
	}

	async deleteOne(id: number): Promise<void> {
		await this.repository.delete({ id });
	}
}
