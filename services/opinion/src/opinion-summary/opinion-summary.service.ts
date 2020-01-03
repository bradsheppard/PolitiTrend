import { Injectable } from '@nestjs/common';
import OpinionSummary from './opinion-summary.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOpinionSummaryDto } from './dto/create-opinion-summary.dto';
import { UpdateOpinionSummaryDto } from './dto/update-opinion-summary.dto';

@Injectable()
export class OpinionSummaryService {

	constructor(
		@InjectRepository(OpinionSummary)
		private readonly opinionSummaryRepository: Repository<OpinionSummary>,
	) {}

	async get(predicate?: {}): Promise<OpinionSummary[]> {
		if (predicate) {
			return await this.opinionSummaryRepository.find(predicate);
		}
		return await this.opinionSummaryRepository.find();
	}

	async getOne(id: number): Promise<OpinionSummary | null> {
		const opinionSummary = await this.opinionSummaryRepository.findOne(id);

		return opinionSummary !== undefined ? opinionSummary : null;
	}

	async insert(createOpinionSummaryDto: CreateOpinionSummaryDto): Promise<OpinionSummary> {
		return await this.opinionSummaryRepository.save(this.opinionSummaryRepository.create(createOpinionSummaryDto));
	}

	async delete() {
		await this.opinionSummaryRepository.clear();
	}

	async update(entity: UpdateOpinionSummaryDto): Promise<boolean> {
		const opinionSummary = this.opinionSummaryRepository.findOne(entity.id);

		if (!opinionSummary) {
			return false;
		}

		await this.opinionSummaryRepository.save(entity);
		return true;
	}

	async deleteOne(id: number): Promise<boolean> {
		const opinionSummary = await this.opinionSummaryRepository.findOne(id.toString());

		if (!opinionSummary) {
			return false;
		}

		await this.opinionSummaryRepository.remove(opinionSummary);

		return true;
	}
}
