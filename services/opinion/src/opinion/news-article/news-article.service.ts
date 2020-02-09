import { SearchNewsArticleDto } from './dto/search-news-article.dto';
import NewsActicle from './news-article.entity';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Sentiment } from '../../sentiment/sentiment.entity';
import { Injectable } from '@nestjs/common';
import { CreateNewsArticleDto } from './dto/create-news-article.dto';
import { UpdateTweetDto } from '../tweet/dto/update-tweet.dto';

@Injectable()
export class NewsArticleService {

	constructor(
		@InjectConnection()
		private readonly connection: Connection,
		@InjectRepository(NewsActicle)
		private readonly newsArticleRepository: Repository<NewsActicle>,
		@InjectRepository(Sentiment)
		private readonly sentimentRepository: Repository<Sentiment>,
	) {}

	async getOne(id: number): Promise<NewsActicle | null> {
		const newsArticle = this.newsArticleRepository.findOne(id);

		return newsArticle !== undefined ? newsArticle : null;
	}

	async get(searchDto?: SearchNewsArticleDto): Promise<NewsActicle[]> {
		if (!searchDto) {
			return await this.newsArticleRepository.find({});
		}

		const query = this.connection.createQueryBuilder();
		query.addSelect('newsarticle')
			.from(NewsActicle, 'newsarticle')
			.leftJoinAndSelect('newsarticle.sentiments', 'sentiment');

		if (searchDto.politicians) {
			query.andWhere('sentiment.politician in (:...politicians)', { politicians: searchDto.politicians });
		}

		if (searchDto.limit) {
			query.limit(searchDto.limit);
		}

		if (searchDto.offset) {
			query.offset(searchDto.offset);
		}

		return await query.getMany();
	}

	async deleteOne(id: number): Promise<boolean> {
		const newsArticle = await this.newsArticleRepository.findOne(id.toString());

		if (!newsArticle) {
			return false;
		}

		await this.newsArticleRepository.remove(newsArticle);

		return true;
	}

	async upsertOnSource(createNewsArticleDto: CreateNewsArticleDto) {
		const updateNewsArticleDto = Object.assign({}, createNewsArticleDto) as UpdateTweetDto;

		const previousTweets = await this.get({source: createNewsArticleDto.source});
		if (previousTweets.length > 0) {
			updateNewsArticleDto.id = previousTweets[0].id;
		}

		const sentiments = [];
		for (const sentiment of createNewsArticleDto.sentiments) {
			const insertedSentiment = await this.sentimentRepository.save(this.sentimentRepository.create(sentiment));
			sentiments.push(insertedSentiment);
		}

		updateNewsArticleDto.sentiments = sentiments;

		const result = await this.newsArticleRepository.save(this.newsArticleRepository.create(updateNewsArticleDto));
		return await this.newsArticleRepository.findOne(result.id);
	}

	async delete(): Promise<void> {
		await this.newsArticleRepository.delete({});
	}
}
