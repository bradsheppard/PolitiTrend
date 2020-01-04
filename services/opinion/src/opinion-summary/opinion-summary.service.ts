import { Injectable } from '@nestjs/common';
import OpinionSummary from './opinion-summary.entity';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateOpinionSummaryDto } from './dto/create-opinion-summary.dto';
import { UpdateOpinionSummaryDto } from './dto/update-opinion-summary.dto';
import { SearchOpinionSummaryDto } from './dto/search-opinion-summary.dto';

@Injectable()
export class OpinionSummaryService {

	constructor(
		@InjectConnection()
		private readonly connection: Connection,
		@InjectRepository(OpinionSummary)
		private readonly opinionSummaryRepository: Repository<OpinionSummary>,
	) {}

	async get(predicate?: SearchOpinionSummaryDto): Promise<OpinionSummary[]> {
		if (predicate) {
			if (predicate.max) {
				const qb = this.connection.createQueryBuilder();
				qb.from(OpinionSummary, 'opinionsummary')
					.where('opinionsummary.id in ' +
						qb.subQuery()
							.from(OpinionSummary, 'opinionsummary')
							.select(`MAX(opinionsummary.id)`, 'id')
							.groupBy('politician').getQuery(),
					);

				if (predicate.politician) {
					qb.andWhere('opinionsummary.politician = :politician', { politician: predicate.politician });
				}

				return qb.getRawMany();
			}
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
