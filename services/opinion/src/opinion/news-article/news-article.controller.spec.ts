import { Test, TestingModule } from '@nestjs/testing';
import { NewsArticleController } from './news-article.controller';
import { NewsArticleService } from './news-article.service';
import { getConnectionToken, getRepositoryToken } from '@nestjs/typeorm';
import NewsArticle from './news-article.entity';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { Sentiment } from '../../sentiment/sentiment.entity';

describe('NewsArticle Controller', () => {
	let controller: NewsArticleController;
	let service: NewsArticleService;

	let id = 0;

	function createNewsArticle() {
		id++;
		return {
			id,
			image: `image_${id}`,
			title: `title_${id}`,
			dateTime: new Date().toUTCString(),
			url: `url_${id}`,
			sentiments: [
				{
					politician: id,
					value: id,
				},
			],
		} as NewsArticle;
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [NewsArticleController],
			providers: [NewsArticleService,
				{
					provide: getConnectionToken(),
					useValue: {},
				},
				{
					provide: getRepositoryToken(NewsArticle),
					useClass: Repository,
				},
				{
					provide: getRepositoryToken(Sentiment),
					useClass: Repository,
				},
			],
		}).compile();

		controller = module.get<NewsArticleController>(NewsArticleController);
		service = module.get<NewsArticleService>(NewsArticleService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
		expect(service).toBeDefined();
	});

	it('can get all', async () => {
		const newsArticle = createNewsArticle();
		jest.spyOn(service, 'get').mockResolvedValueOnce([newsArticle]);
		expect(await controller.findAll({})).toEqual([newsArticle]);
	});

	it('can get with politician', async () => {
		const newsArticle = createNewsArticle();
		const getSpy = jest.spyOn(service, 'get').mockResolvedValueOnce([newsArticle]);
		await controller.findAll({politicians: [1]});
		expect(getSpy).toBeCalledWith({politicians: [1]});
	});

	it('can get one when exists', async () => {
		const newsArticle = createNewsArticle();
		jest.spyOn(service, 'getOne').mockResolvedValueOnce(newsArticle);
		expect(await controller.findOne(newsArticle.id.toString())).toEqual(newsArticle);
	});

	it('cant get returns 404 when not exists', async () => {
		jest.spyOn(service, 'getOne').mockResolvedValueOnce(null);
		await expect(controller.findOne('1')).rejects.toThrowError(new HttpException('Not found', 404));
	});

	it('delete one when exists', async () => {
		jest.spyOn(service, 'deleteOne').mockResolvedValueOnce(true);
		await expect(controller.deleteOne('1')).resolves.not.toThrow();
	});

	it('delete one returns 404 when not exists', async () => {
		jest.spyOn(service, 'deleteOne').mockResolvedValueOnce(false);
		await expect(controller.deleteOne('1')).rejects.toThrowError(new HttpException('Not found', 404));
	});

	it('delete all', async () => {
		const deleteSpy = jest.spyOn(service, 'delete').mockImplementation();
		await controller.delete();
		expect(deleteSpy).toBeCalled();
	});

	it('can insert on event', async () => {
		const newsArticle = createNewsArticle();
		const insertSpy = jest.spyOn(service, 'upsertOnUrl').mockImplementation();
		await controller.handleNewsArticleCreated(newsArticle);
		expect(insertSpy).toBeCalled();
	});
});
