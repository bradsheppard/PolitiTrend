import { SearchNewsArticleDto } from './dto/search-news-article.dto';
import NewsArticle from './news-article.entity';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
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
			.from(NewsArticle, 'newsarticle');

		if (searchDto.politician) {
			query.andWhere(':politician = ANY(newsarticle.politicians)', { politician: searchDto.politician });
		}

		if (searchDto.url) {
			query.andWhere('newsarticle.url = :url', { url: searchDto.url });
		}

		if (searchDto.title) {
			query.andWhere('newsarticle.title like %:title%', { title: searchDto.title });
		}

		if (searchDto.source) {
			query.andWhere('newsarticle.source like %:source%', { source: searchDto.source });
		}

		if (searchDto.limit) {
			query.limit(searchDto.limit);
		}

		if (searchDto.offset) {
			query.offset(searchDto.offset);
		}

		query.orderBy('newsarticle.dateTime', 'DESC');

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

	async upsertOnUrl(createNewsArticleDto: CreateNewsArticleDto) {
		const updateNewsArticleDto = Object.assign({}, createNewsArticleDto) as UpdateNewsArticleDto;

		const previousNewsArticles = await this.get({url: createNewsArticleDto.url});
		if (previousNewsArticles.length > 0) {
			updateNewsArticleDto.id = previousNewsArticles[0].id;
		}

		const result = await this.newsArticleRepository.save(this.newsArticleRepository.create(updateNewsArticleDto));
		return await this.newsArticleRepository.findOne(result.id);
	}

	async delete(): Promise<void> {
		await this.newsArticleRepository.delete({});
	}
}
