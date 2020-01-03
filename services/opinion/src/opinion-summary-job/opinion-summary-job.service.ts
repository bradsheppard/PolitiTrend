import { Injectable } from '@nestjs/common';
import OpinionSummaryJob from './opinion-summary-job.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOpinionSummaryJobDto } from './dto/create-opinion-summary-job.dto';
import { UpdateOpinionSummaryJobDto } from './dto/update-opinion-summary-job.dto';

@Injectable()
export class OpinionSummaryJobService {

	constructor(
		@InjectRepository(OpinionSummaryJob)
		private readonly repository: Repository<OpinionSummaryJob>,
	) {}

	async deleteOne(id: number): Promise<boolean> {
		const opinion = await this.repository.findOne(id.toString());

		if (!opinion) {
			return false;
		}

		await this.repository.remove(opinion);

		return true;
	}

	async delete(): Promise<void> {
		await this.repository.clear();
	}

	async get(predicate?: {}): Promise<OpinionSummaryJob[]> {
		if (predicate) {
			return await this.repository.find(predicate);
		}
		return await this.repository.find();
	}

	async getOne(id: number): Promise<OpinionSummaryJob> {
		const opinion = await this.repository.findOne(id);

		return opinion !== undefined ? opinion : null;
	}

	async insert(entity: CreateOpinionSummaryJobDto): Promise<OpinionSummaryJob> {
		return await this.repository.save(this.repository.create(entity));
	}

	async update(entity: UpdateOpinionSummaryJobDto): Promise<boolean> {
		const opinion = this.repository.findOne(entity.id);

		if (!opinion) {
			return false;
		}

		await this.repository.save(entity);
		return true;
	}
}
