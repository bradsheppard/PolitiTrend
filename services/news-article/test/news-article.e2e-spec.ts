import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateNewsArticleDto } from '../src/news-article/dto/create-news-article.dto';
import NewsArticle from '../src/news-article/news-article.entity';
import { NewsArticleService } from '../src/news-article/news-article.service';
import { ClientProxy, ClientsModule } from '@nestjs/microservices';
import microserviceConfig from '../src/config/config.microservice';
import { ClientProviderOptions } from '@nestjs/microservices/module/interfaces/clients-module.interface';
import waitForExpect from 'wait-for-expect';
import { UpdateNewsArticleDto } from '../src/news-article/dto/update-news-article.dto';

waitForExpect.defaults.timeout = 20000;
jest.setTimeout(30000);

let app: INestApplication;
let service: NewsArticleService;
let client: ClientProxy;

let id = 0;

function createNewsArticleDto() {
	id++;
	return {
		id,
		image: `image_${id}`,
		title: `title_${id}`,
		dateTime: new Date().toUTCString(),
		url: `url_${id}`,
		source: `source_${id}`,
		description: `source_${id}`,
		politicians: [id],
		summary: `Test summary ${id}`
	} as CreateNewsArticleDto;
}

beforeAll(async () => {
	const name = {
		name: 'NEWS_ARTICLE_SERVICE',
	};

	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [
			AppModule,
			ClientsModule.register([
				{
					...microserviceConfig,
					...name,
				} as ClientProviderOptions,
			]),
		],
	}).compile();

	app = moduleFixture.createNestApplication();
	app.connectMicroservice(microserviceConfig);

	service = moduleFixture.get<NewsArticleService>(NewsArticleService);
	client = app.get('NEWS_ARTICLE_SERVICE');

	await app.init();
	await app.startAllMicroservicesAsync();

	await client.connect();
});

afterAll(async () => {
	await client.close();
	await app.close();
});

beforeEach(async () => {
	await service.delete();
});

describe('NewsArticleController (e2e)', () => {

	it('/ (GET)', async () => {
		const response = await request(app.getHttpServer())
			.get('/');

		expect(response.status).toEqual(200);
	});

	it('/ (POST)', async () => {
		const newsArticleDto = createNewsArticleDto();
		const res = await request(app.getHttpServer())
			.post('/')
			.send(newsArticleDto);

		const resultingNewsArticle = res.body as NewsArticle;
		const insertedNewsArticle = newsArticleDto as NewsArticle;
		insertedNewsArticle.id = resultingNewsArticle.id;

		expect(res.status).toEqual(201);
		expect(resultingNewsArticle).toEqual(insertedNewsArticle);
	});

	it('/:id (GET)', async () => {
		const newsArticleDto = createNewsArticleDto();
		const postResponse = await request(app.getHttpServer())
			.post('/')
			.send(newsArticleDto);

		const resultingNewsArticle = postResponse.body as NewsArticle;
		const getResponse = await request(app.getHttpServer())
			.get(`/${resultingNewsArticle.id}`);

		expect(getResponse.status).toEqual(200);
		expect(getResponse.body).toEqual(resultingNewsArticle);
	});

	it('/:id (DELETE)', async () => {
		const newsArticleDto = createNewsArticleDto();
		const postResponse = await request(app.getHttpServer())
			.post('/')
			.send(newsArticleDto);

		const resultingNewsArticle = postResponse.body as NewsArticle;

		const deleteResponse = await request(app.getHttpServer())
			.delete(`/${resultingNewsArticle.id}`);
		const getResponse = await request(app.getHttpServer())
			.get(`/${resultingNewsArticle.id}`);

		expect(deleteResponse.status).toEqual(200);
		expect(getResponse.status).toEqual(404);
	});

	it('/ (DELETE)', async () => {
		const newsArticle1 = createNewsArticleDto();
		const newsArticle2 = createNewsArticleDto();
		await Promise.all([
			request(app.getHttpServer()).post('/').send(newsArticle1),
			request(app.getHttpServer()).post('/').send(newsArticle2),
		]);

		const deleteResponse = await request(app.getHttpServer()).delete('/');
		const getResponse = await request(app.getHttpServer()).get('/');

		const newsArticles = getResponse.body as NewsArticle[];

		expect(deleteResponse.status).toEqual(200);
		expect(getResponse.status).toEqual(200);
		expect(newsArticles).toHaveLength(0);
	});

	it('handle newsArticle created', async () => {
		const newsArticleDto = createNewsArticleDto();
		const json = await client.emit('news-article-created', newsArticleDto).toPromise();

		expect(json[0].topicName).toEqual('news-article-created');

		await waitForExpect(async () => {
			const newsArticles: NewsArticle[] = await service.get({});
			expect(newsArticles.length).toEqual(1);
		});
	});
});

describe('NewsArticleService (e2e)', () => {

	it('Can get all', async () => {
		const newsArticle1 = createNewsArticleDto();
		const newsArticle2 = createNewsArticleDto();

		const firstInsert = await service.upsertOnUrl(newsArticle1);
		const secondInsert = await service.upsertOnUrl(newsArticle2);

		const newsArticles = await service.get();

		expect(newsArticles).toEqual([firstInsert, secondInsert]);
	});

	it('Can get when nothing exists', async () => {
		const newsArticles = await service.get();

		expect(newsArticles).toHaveLength(0);
	});

	it('Can get', async () => {
		const newsArticle = createNewsArticleDto();
		const insertedNewsArticle = await service.upsertOnUrl(newsArticle);

		const retrievedNewsArticle = await service.getOne(insertedNewsArticle.id);
		expect(retrievedNewsArticle).toEqual(insertedNewsArticle);
	});

	it('Can get by politician', async () => {
		const newsArticle1 = createNewsArticleDto();
		const newsArticle2 = createNewsArticleDto();
		const insertedNewsArticle1 = await service.upsertOnUrl(newsArticle1);
		await service.upsertOnUrl(newsArticle2);

		const politicianNewsArticles = await service.get({politician: insertedNewsArticle1.politicians[0]});

		expect(politicianNewsArticles).toHaveLength(1);
		for (const newsArticle of politicianNewsArticles) {
			expect(newsArticle.politicians[0]).toEqual(insertedNewsArticle1.politicians[0]);
		}
	});

	it('Can get with limit and offset', async () => {
		const newsArticle1 = createNewsArticleDto();
		const newsArticle2 = createNewsArticleDto();
		const newsArticle3 = createNewsArticleDto();

		newsArticle1.dateTime = 'Wed, 26 Aug 2020 21:50:38 GMT';
		newsArticle2.dateTime = 'Wed, 26 Aug 2020 21:51:38 GMT';
		newsArticle3.dateTime = 'Wed, 26 Aug 2020 21:52:38 GMT'

		await Promise.all([
			service.upsertOnUrl(newsArticle1),
			service.upsertOnUrl(newsArticle2),
			service.upsertOnUrl(newsArticle3)
		]);

		const newsArticles = await service.get({limit: 2, offset: 1});
		expect(newsArticles).toHaveLength(2);

		expect(newsArticles[1].url).toEqual(newsArticle1.url);
		expect(newsArticles[1].image).toEqual(newsArticle1.image);

		expect(newsArticles[0].url).toEqual(newsArticle2.url);
		expect(newsArticles[0].image).toEqual(newsArticle2.image);
	});

	it('Can delete one', async () => {
		const newsArticle = createNewsArticleDto();
		const insertedNewsArticle = await service.upsertOnUrl(newsArticle);
		await service.deleteOne(insertedNewsArticle.id);

		const retrievedNewsArticle: NewsArticle | null = await service.getOne(insertedNewsArticle.id);

		expect(retrievedNewsArticle).toBeNull();
	});

	it('Can delete all', async () => {
		const newsArticle1 = createNewsArticleDto();
		const newsArticle2 = createNewsArticleDto();
		await Promise.all([
			service.upsertOnUrl(newsArticle1),
			service.upsertOnUrl(newsArticle2),
		]);

		await service.delete();

		const allNewsArticles = await service.get();
		expect(allNewsArticles).toHaveLength(0);
	});

	it('Can update', async () => {
		const newsArticleDto = createNewsArticleDto();
		const insertedNewsArticle = (await service.upsertOnUrl(newsArticleDto)) as UpdateNewsArticleDto;
		insertedNewsArticle.image = 'New newsArticle text';

		await service.upsertOnUrl(insertedNewsArticle);

		const updatedNewsArticle = await service.getOne(insertedNewsArticle.id);

		expect(updatedNewsArticle).toEqual(insertedNewsArticle);
	});

	it('Can upsert on newsArticle Id, new newsArticle inserted', async () => {
		const newsArticle = createNewsArticleDto();

		const upsertedNewsArticle = await service.upsertOnUrl(newsArticle);

		const retrievedNewsArticle = await service.getOne(upsertedNewsArticle.id);
		expect(retrievedNewsArticle).toEqual(upsertedNewsArticle);
	});

	it('Can upsert on newsArticle Id, existing newsArticle updated', async () => {
		const newsArticle = createNewsArticleDto();

		await service.upsertOnUrl(newsArticle);
		const updatedNewsArticle = createNewsArticleDto() as any;
		updatedNewsArticle.url = newsArticle.url;

		const resultingNewsArticle = await service.upsertOnUrl(updatedNewsArticle);
		updatedNewsArticle.id = resultingNewsArticle.id;

		const retrievedNewsArticle = await service.getOne(resultingNewsArticle.id);
		expect(retrievedNewsArticle).toEqual(updatedNewsArticle);
	});

	it('Can upsert on newsArticleId, nothing changed', async () => {
		const newsArticle = createNewsArticleDto();

		await service.upsertOnUrl(newsArticle);
		const resultingNewsArticle = await service.upsertOnUrl(newsArticle);

		expect(resultingNewsArticle.image).toEqual(newsArticle.image);
		expect(resultingNewsArticle.url).toEqual(newsArticle.url);
	});
});
