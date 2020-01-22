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
		const currentDateTime = new Date();
		currentDateTime.setDate(currentDateTime.getDate() - 1);

		const result = await this.connection.createQueryBuilder()
			.select('AVG(sentiment.value)', 'avg')
			.from(Sentiment, 'sentiment')
			.innerJoin('sentiment.opinion', 'opinion')
			.where('sentiment.politician = :id', {id: politicianId})
			.andWhere('sentiment.value != 5')
			.andWhere('opinion.dateTime >= :dateTime', {dateTime: currentDateTime.toUTCString()})
			.getRawOne();

		return result.avg;
	}
}
