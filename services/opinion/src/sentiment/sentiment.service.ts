import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Sentiment } from './sentiment.entity';

@Injectable()
export class SentimentService {
	constructor(
		@InjectConnection()
		private readonly connection: Connection,
	) {}

	async getSentimentAverageForPolitician(politicianId: number): Promise<number | null> {
		const result = await this.connection.createQueryBuilder()
			.select('AVG(sentiment.value)', 'avg')
			.from(Sentiment, 'sentiment')
			.where('sentiment.politician = :id', {id: politicianId})
			.getRawOne();

		return result.avg;
	}
}
