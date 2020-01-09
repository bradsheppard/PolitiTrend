import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, InsertResult, Repository } from 'typeorm';
import Tweet from './tweet.entity';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';

@Injectable()
export class TweetService {

	constructor(
		@InjectConnection()
		private readonly connection: Connection,
		@InjectRepository(Tweet)
		private readonly repository: Repository<Tweet>,
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

	async get(predicate?: {}): Promise<Tweet[]> {
		if (predicate) {
			return await this.repository.find(predicate);
		}
		return await this.repository.find();
	}

	async getOne(id: number): Promise<Tweet | null> {
		const opinion = await this.repository.findOne(id);

		return opinion !== undefined ? opinion : null;
	}

	async insert(entity: CreateTweetDto): Promise<Tweet> {
		return await this.repository.save(this.repository.create(entity));
	}

	async update(entity: UpdateTweetDto): Promise<boolean> {
		const opinion = await this.repository.findOne(entity.id);

		if (!opinion) {
			return false;
		}

		await this.repository.save(this.repository.create(entity));
		return true;
	}

	async upsertOnTweetId(opinion: CreateTweetDto): Promise<Tweet> {
		const insertResult: InsertResult = await this.connection.createQueryBuilder()
			.insert()
			.into(Tweet)
			.values(opinion)
			.onConflict(`("tweetId") DO UPDATE SET "tweetText" = :tweetText`)
			.setParameter('tweetText', opinion.tweetText)
			.execute();

		const insertedOpinion: Tweet = Object.assign({}, opinion) as Tweet;
		insertedOpinion.id = insertResult.identifiers[0].id;

		return insertedOpinion;
	}

	async getSentimentAverageForPolitician(politicianId: number): Promise<number | null> {
		const result = await this.connection.createQueryBuilder()
			.select('AVG(sentiment)', 'avg')
			.from(Tweet, 'tweet')
			.where('tweet.politician = :id', {id: politicianId})
			.getRawOne();

		return result.avg;
	}
}
