import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateNewsArticleDto } from '../src/opinion/news-article/dto/create-news-article.dto';
import NewsArticle from '../src/opinion/news-article/news-article.entity';
import { NewsArticleService } from '../src/opinion/news-article/news-article.service';
import { ClientProxy, ClientsModule } from '@nestjs/microservices';
import microserviceConfig from '../src/config/config.microservice';
import { ClientProviderOptions } from '@nestjs/microservices/module/interfaces/clients-module.interface';
import waitForExpect from 'wait-for-expect';
import { UpdateNewsArticleDto } from '../src/opinion/news-article/dto/update-news-article.dto';

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
		source: `source_${id}`,
		title: `title_${id}`,
		dateTime: new Date().toUTCString(),
		url: `url_${id}`,
		sentiments: [
			{
				politician: id,
				value: id,
			},
		],
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
			.get('/newsarticle');

		expect(response.status).toEqual(200);
	});

	it('/ (POST)', async () => {
		const newsArticleDto = createNewsArticleDto();
		const res = await request(app.getHttpServer())
			.post('/newsarticle')
			.send(newsArticleDto);

		const resultingNewsArticle = res.body as NewsArticle;
		const insertedNewsArticle = newsArticleDto as NewsArticle;
		insertedNewsArticle.id = resultingNewsArticle.id;
		insertedNewsArticle.sentiments[0].id = resultingNewsArticle.sentiments[0].id;

		expect(res.status).toEqual(201);
		expect(resultingNewsArticle).toEqual(insertedNewsArticle);
	});

	it('/:id (GET)', async () => {
		const newsArticleDto = createNewsArticleDto();
		const postResponse = await request(app.getHttpServer())
			.post('/newsarticle')
			.send(newsArticleDto);

		const resultingNewsArticle = postResponse.body as NewsArticle;
		const getResponse = await request(app.getHttpServer())
			.get(`/newsarticle/${resultingNewsArticle.id}`);

		expect(getResponse.status).toEqual(200);
		expect(getResponse.body).toEqual(resultingNewsArticle);
	});

	it('/:id (DELETE)', async () => {
		const newsArticleDto = createNewsArticleDto();
		const postResponse = await request(app.getHttpServer())
			.post('/newsarticle')
			.send(newsArticleDto);

		const resultingNewsArticle = postResponse.body as NewsArticle;

		const deleteResponse = await request(app.getHttpServer())
			.delete(`/newsarticle/${resultingNewsArticle.id}`);
		const getResponse = await request(app.getHttpServer())
			.get(`/newsarticle/${resultingNewsArticle.id}`);

		expect(deleteResponse.status).toEqual(200);
		expect(getResponse.status).toEqual(404);
	});

	it('/ (DELETE)', async () => {
		const newsArticle1 = createNewsArticleDto();
		const newsArticle2 = createNewsArticleDto();
		await Promise.all([
			request(app.getHttpServer()).post('/newsarticle').send(newsArticle1),
			request(app.getHttpServer()).post('/newsarticle').send(newsArticle2),
		]);

		const deleteResponse = await request(app.getHttpServer()).delete('/newsarticle');
		const getResponse = await request(app.getHttpServer()).get('/newsarticle');

		const newsArticles = getResponse.body as NewsArticle[];

		expect(deleteResponse.status).toEqual(200);
		expect(getResponse.status).toEqual(200);
		expect(newsArticles).toHaveLength(0);
	});

	it('handle newsArticle created', async () => {
		const newsArticleDto = createNewsArticleDto();
		const json = await client.emit('news_article_created', newsArticleDto).toPromise();

		expect(json[0].topicName).toEqual('news_article_created');

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

		const firstInsert = await service.upsertOnSource(newsArticle1);
		const secondInsert = await service.upsertOnSource(newsArticle2);

		const newsArticles = await service.get();

		expect(newsArticles).toEqual([firstInsert, secondInsert]);
	});

	it('Can get when nothing exists', async () => {
		const newsArticles = await service.get();

		expect(newsArticles).toHaveLength(0);
	});

	it('Can get', async () => {
		const newsArticle = createNewsArticleDto();
		const insertedNewsArticle = await service.upsertOnSource(newsArticle);

		const retrievedNewsArticle = await service.getOne(insertedNewsArticle.id);
		expect(retrievedNewsArticle).toEqual(insertedNewsArticle);
	});

	it('Can get by politician', async () => {
		const newsArticle1 = createNewsArticleDto();
		const newsArticle2 = createNewsArticleDto();
		const insertedNewsArticle1 = await service.upsertOnSource(newsArticle1);
		await service.upsertOnSource(newsArticle2);

		const politicianNewsArticles = await service.get({politicians: [insertedNewsArticle1.sentiments[0].politician]});

		expect(politicianNewsArticles).toHaveLength(1);
		for (const newsArticle of politicianNewsArticles) {
			expect(newsArticle.sentiments[0].politician).toEqual(insertedNewsArticle1.sentiments[0].politician);
		}
	});

	it('Can get with limit and offset', async () => {
		const newsArticle1 = createNewsArticleDto();
		const newsArticle2 = createNewsArticleDto();
		const newsArticle3 = createNewsArticleDto();

		await service.upsertOnSource(newsArticle1);

		await Promise.all([
			service.upsertOnSource(newsArticle2),
			service.upsertOnSource(newsArticle3),
		]);

		const newsArticles = await service.get({limit: 2, offset: 1});
		expect(newsArticles).toHaveLength(2);

		expect(newsArticles[0].source).toEqual(newsArticle2.source);
		expect(newsArticles[0].image).toEqual(newsArticle2.image);

		expect(newsArticles[1].source).toEqual(newsArticle3.source);
		expect(newsArticles[1].image).toEqual(newsArticle3.image);
	});

	it('Can delete one', async () => {
		const newsArticle = createNewsArticleDto();
		const insertedNewsArticle = await service.upsertOnSource(newsArticle);
		await service.deleteOne(insertedNewsArticle.id);

		const retrievedNewsArticle: NewsArticle | null = await service.getOne(insertedNewsArticle.id);

		expect(retrievedNewsArticle).toBeNull();
	});

	it('Can delete all', async () => {
		const newsArticle1 = createNewsArticleDto();
		const newsArticle2 = createNewsArticleDto();
		await Promise.all([
			service.upsertOnSource(newsArticle1),
			service.upsertOnSource(newsArticle2),
		]);

		await service.delete();

		const allNewsArticles = await service.get();
		expect(allNewsArticles).toHaveLength(0);
	});

	it('Can update', async () => {
		const newsArticleDto = createNewsArticleDto();
		const insertedNewsArticle = (await service.upsertOnSource(newsArticleDto)) as UpdateNewsArticleDto;
		insertedNewsArticle.image = 'New newsArticle text';

		await service.upsertOnSource(insertedNewsArticle);

		const updatedNewsArticle = await service.getOne(insertedNewsArticle.id);

		expect(updatedNewsArticle).toEqual(insertedNewsArticle);
	});

	it('Can upsert on newsArticle Id, new newsArticle inserted', async () => {
		const newsArticle = createNewsArticleDto();

		const upsertedNewsArticle = await service.upsertOnSource(newsArticle);

		const retrievedNewsArticle = await service.getOne(upsertedNewsArticle.id);
		expect(retrievedNewsArticle).toEqual(upsertedNewsArticle);
	});

	it('Can upsert on newsArticle Id, existing newsArticle updated', async () => {
		const newsArticle = createNewsArticleDto();

		await service.upsertOnSource(newsArticle);
		const updatedNewsArticle = createNewsArticleDto() as any;
		updatedNewsArticle.source = newsArticle.source;

		const resultingNewsArticle = await service.upsertOnSource(updatedNewsArticle);
		updatedNewsArticle.id = resultingNewsArticle.id;
		updatedNewsArticle.sentiments[0].id = resultingNewsArticle.sentiments[0].id;

		const retrievedNewsArticle = await service.getOne(resultingNewsArticle.id);
		expect(retrievedNewsArticle).toEqual(updatedNewsArticle);
	});

	it('Can upsert on newsArticleId, sentiments updated', async () => {
		const newsArticle = createNewsArticleDto() as any;

		const insertedNewsArticle = await service.upsertOnSource(newsArticle);
		newsArticle.sentiments = [
			{
				politician: 45,
				value: 4.5,
			},
		];

		await service.upsertOnSource(newsArticle);

		const retrievedNewsArticle = await service.getOne(insertedNewsArticle.id);
		newsArticle.sentiments[0].id = retrievedNewsArticle.sentiments[0].id;

		expect(retrievedNewsArticle.image).toEqual(newsArticle.image);
		expect(retrievedNewsArticle.sentiments).toEqual(newsArticle.sentiments);
	});

	it('Can upsert on newsArticleId, nothing changed', async () => {
		const newsArticle = createNewsArticleDto();

		await service.upsertOnSource(newsArticle);
		const resultingNewsArticle = await service.upsertOnSource(newsArticle);

		expect(resultingNewsArticle.image).toEqual(newsArticle.image);
		expect(resultingNewsArticle.source).toEqual(newsArticle.source);
	});

	it('Can upsert with no sentiments, no exceptions', async () => {
		const newsArticle = createNewsArticleDto();
		newsArticle.sentiments = [];

		await service.upsertOnSource(newsArticle);
		const resultingNewsArticle = await service.upsertOnSource(newsArticle);

		expect(resultingNewsArticle.sentiments).toHaveLength(0);
	});
});
