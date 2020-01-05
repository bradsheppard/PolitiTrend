import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, InsertResult, Repository } from 'typeorm';
import Opinion from './opinion.entity';
import { CreateOpinionDto } from './dto/create-opinion.dto';
import { UpdateOpinionDto } from './dto/update-opinion.dto';

@Injectable()
export class OpinionService {

	constructor(
		@InjectConnection()
		private readonly connection: Connection,
		@InjectRepository(Opinion)
		private readonly repository: Repository<Opinion>,
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

	async get(predicate?: {}): Promise<Opinion[]> {
		if (predicate) {
			return await this.repository.find(predicate);
		}
		return await this.repository.find();
	}

	async getOne(id: number): Promise<Opinion | null> {
		const opinion = await this.repository.findOne(id);

		return opinion !== undefined ? opinion : null;
	}

	async insert(entity: CreateOpinionDto): Promise<Opinion> {
		return await this.repository.save(this.repository.create(entity));
	}

	async update(entity: UpdateOpinionDto): Promise<boolean> {
		const opinion = await this.repository.findOne(entity.id);

		if (!opinion) {
			return false;
		}

		await this.repository.save(this.repository.create(entity));
		return true;
	}

	async upsertOnTweetId(opinion: CreateOpinionDto): Promise<Opinion> {
		const insertResult: InsertResult = await this.connection.createQueryBuilder()
			.insert()
			.into(Opinion)
			.values(opinion)
			.onConflict(`("tweetId") DO UPDATE SET "tweetText" = :tweetText`)
			.setParameter('tweetText', opinion.tweetText)
			.execute();

		const insertedOpinion: Opinion = Object.assign({}, opinion) as Opinion;
		insertedOpinion.id = insertResult.identifiers[0].id;

		return insertedOpinion;
	}

	async getSentimentAverageForPolitician(politicianId: number): Promise<number | null> {
		const result = await this.connection.createQueryBuilder()
			.select('AVG(sentiment)', 'avg')
			.from(Opinion, 'opinion')
			.where('opinion.politician = :id', {id: politicianId})
			.getRawOne();

		return result.avg;
	}
}
