import { Test, TestingModule } from '@nestjs/testing';
import { NewsArticleService } from './news-article.service';
import { getConnectionToken, getRepositoryToken } from '@nestjs/typeorm';
import NewsArticle from './news-article.entity';
import { Repository } from 'typeorm';

describe('NewsArticle Service', () => {
	let service: NewsArticleService;
	let newsArticleRepository: Repository<NewsArticle>;

	let id = 0;

	function createNewsArticle() {
		id++;
		return {
			id,
			image: `image_${id}`,
			title: `title_${id}`,
			dateTime: new Date().toUTCString(),
			url: `url_${id}`,
			politicians: [id]
		} as NewsArticle;
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [NewsArticleService,
				{
					provide: getConnectionToken(),
					useValue: {},
				},
				{
					provide: getRepositoryToken(NewsArticle),
					useClass: Repository,
				}
			],
		}).compile();

		service = module.get<NewsArticleService>(NewsArticleService);
		newsArticleRepository = module.get<Repository<NewsArticle>>(getRepositoryToken(NewsArticle));
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(newsArticleRepository).toBeDefined();
	});

	it('can get all', async () => {
		const opinion = createNewsArticle();
		jest.spyOn(newsArticleRepository, 'find').mockResolvedValueOnce([opinion]);
		expect(await service.get()).toEqual([opinion]);
	});

	it('can get one', async () => {
		const opinion = createNewsArticle();
		jest.spyOn(newsArticleRepository, 'findOne').mockResolvedValueOnce(opinion);
		expect(await service.getOne(opinion.id)).toEqual(opinion);
	});

	it('can delete', async () => {
		const deleteSpy = jest.spyOn(newsArticleRepository, 'delete').mockImplementation();
		await service.delete();
		expect(deleteSpy).toBeCalled();
	});
});
