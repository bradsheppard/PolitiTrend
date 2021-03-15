import { Injectable } from '@nestjs/common';
import { FindManyOptions, In, Repository } from 'typeorm';
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

	private static buildQueryParams(
		searchPoliticianDto: SearchPoliticianDto,
	): FindManyOptions<Politician> {
		const queryParams: FindManyOptions<Politician> = {};

		const limit = searchPoliticianDto.limit;
		const offset = searchPoliticianDto.offset;

		delete searchPoliticianDto.limit;
		delete searchPoliticianDto.offset;

		if (searchPoliticianDto.role) {
			const role = searchPoliticianDto.role;
			delete searchPoliticianDto.role;
			queryParams.where = { role: In(role), ...searchPoliticianDto };
		} else {
			queryParams.where = searchPoliticianDto;
		}

		if (limit) {
			queryParams.take = limit;
		}
		if (offset) {
			queryParams.skip = offset;
		}

		queryParams.order = {
			id: 'ASC',
		};

		return queryParams;
	}

	async get(searchPoliticianDto: SearchPoliticianDto): Promise<Politician[]> {
		const queryParams = PoliticiansService.buildQueryParams(
			searchPoliticianDto,
		);

		return await this.repository.find(queryParams);
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
