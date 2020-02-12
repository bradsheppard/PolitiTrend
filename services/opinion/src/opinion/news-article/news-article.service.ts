import { SearchNewsArticleDto } from './dto/search-news-article.dto';
import NewsArticle from './news-article.entity';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Sentiment } from '../../sentiment/sentiment.entity';
import { Injectable } from '@nestjs/common';
import { CreateNewsArticleDto } from './dto/create-news-article.dto';
import { UpdateNewsArticleDto } from './dto/update-news-article.dto';

@Injectable()
export class NewsArticleService {

	constructor(
		@InjectConnection()
		private readonly connection: Connection,
		@InjectRepository(NewsArticle)
		private readonly newsArticleRepository: Repository<NewsArticle>,
		@InjectRepository(Sentiment)
		private readonly sentimentRepository: Repository<Sentiment>,
	) {}

	async getOne(id: number): Promise<NewsArticle | null> {
		const newsArticle = await this.newsArticleRepository.findOne(id);

		return newsArticle !== undefined ? newsArticle : null;
	}

	async get(searchDto?: SearchNewsArticleDto): Promise<NewsArticle[]> {
		if (!searchDto) {
			return await this.newsArticleRepository.find({});
		}

		const query = this.connection.createQueryBuilder();
		query.addSelect('newsarticle')
			.from(NewsArticle, 'newsarticle')
			.leftJoinAndSelect('newsarticle.sentiments', 'sentiment');

		if (searchDto.politicians) {
			query.andWhere('sentiment.politician in (:...politicians)', { politicians: searchDto.politicians });
		}

		if (searchDto.source) {
			query.andWhere('newsarticle.source = :source', { source: searchDto.source });
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
		const updateNewsArticleDto = Object.assign({}, createNewsArticleDto) as UpdateNewsArticleDto;

		const previousNewsArticles = await this.get({source: createNewsArticleDto.source});
		if (previousNewsArticles.length > 0) {
			updateNewsArticleDto.id = previousNewsArticles[0].id;
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
