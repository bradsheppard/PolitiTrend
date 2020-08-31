import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateTweetDto } from '../src/tweet/dto/create-tweet.dto';
import { TweetService } from '../src/tweet/tweet.service';
import { ClientProxy, ClientsModule } from '@nestjs/microservices';
import microserviceConfig from '../src/config/config.microservice';
import { ClientProviderOptions } from '@nestjs/microservices/module/interfaces/clients-module.interface';
import waitForExpect from 'wait-for-expect';
import { Tweet } from '../src/tweet/schemas/tweet.schema';
import { DocumentDefinition } from 'mongoose';

waitForExpect.defaults.timeout = 20000;
jest.setTimeout(30000);

let app: INestApplication;
let service: TweetService;
let client: ClientProxy;

let id = 0;

function createTweetDto() {
	id++;
	return {
		tweetId: id.toString(),
		tweetText: `Test tweet ${id}`,
		dateTime: new Date(),
		politicians: [id],
		location: `test location ${id}`
	} as CreateTweetDto;
}

beforeAll(async () => {
	const name = {
		name: 'TWEET_SERVICE',
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
	app.useGlobalPipes(new ValidationPipe({transform: true, skipMissingProperties: true}));
	app.connectMicroservice(microserviceConfig);

	service = moduleFixture.get<TweetService>(TweetService);
	client = app.get('TWEET_SERVICE');

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

describe('TweetController (e2e)', () => {

	it('/health (GET)', async () => {
		const response = await request(app.getHttpServer())
			.get('/health');

		expect(response.status).toEqual(200);
	});

	it('/ (GET)', async () => {
		const response = await request(app.getHttpServer())
		  .get('/');

		expect(response.status).toEqual(200);
	});

	it('/ (POST)', async () => {
		const tweetDto: any = createTweetDto();
		const res = await request(app.getHttpServer())
			.post('/')
			.send(tweetDto);

		const resultingTweet = res.body as Tweet;
		tweetDto.id = resultingTweet.id;
		tweetDto.dateTime = tweetDto.dateTime.toISOString();

		expect(res.status).toEqual(201);
		expect(resultingTweet).toEqual(tweetDto);
	});

	it('/:id (GET)', async () => {
		const tweetDto = createTweetDto();
		const postResponse = await request(app.getHttpServer())
			.post('/')
			.send(tweetDto);

		const resultingTweet = postResponse.body as Tweet;
		const getResponse = await request(app.getHttpServer())
			.get(`/${resultingTweet.id}`);

		expect(getResponse.status).toEqual(200);
		expect(getResponse.body).toEqual(resultingTweet);
	});

	it('/:id (DELETE)', async () => {
		const tweetDto = createTweetDto();
		const postResponse = await request(app.getHttpServer())
			.post('/')
			.send(tweetDto);

		const resultingTweet = postResponse.body as Tweet;

		const deleteResponse = await request(app.getHttpServer())
			.delete(`/${resultingTweet.id}`);
		const getResponse = await request(app.getHttpServer())
			.get(`/${resultingTweet.id}`);

		expect(deleteResponse.status).toEqual(200);
		expect(getResponse.status).toEqual(404);
	});

	it('/ (DELETE)', async () => {
		const tweet1 = createTweetDto();
		const tweet2 = createTweetDto();
		await Promise.all([
			request(app.getHttpServer()).post('/').send(tweet1),
			request(app.getHttpServer()).post('/').send(tweet2),
		]);

		const deleteResponse = await request(app.getHttpServer()).delete('/');
		const getResponse = await request(app.getHttpServer()).get('/');

		const tweets = getResponse.body as Tweet[];

		expect(deleteResponse.status).toEqual(200);
		expect(getResponse.status).toEqual(200);
		expect(tweets).toHaveLength(0);
	});

	it('handle tweet created', async () => {
		const tweetDto = createTweetDto();
		const json = await client.emit('tweet-created', tweetDto).toPromise();

		expect(json[0].topicName).toEqual('tweet-created');

		await waitForExpect(async () => {
			const tweets: DocumentDefinition<Tweet>[] = await service.get({});
			expect(tweets.length).toEqual(1);
		});
	});
});

describe('TweetService (e2e)', () => {

	it('Can get all', async () => {
		const tweet1 = createTweetDto();
		const tweet2 = createTweetDto();

		const firstInsert = await service.create(tweet1);
		const secondInsert = await service.create(tweet2);

		const tweets = (await service.get({})).map(x => x.toObject());

		expect(tweets).toEqual([secondInsert.toObject(), firstInsert.toObject()]);
	});

	it('Can get when nothing exists', async () => {
		const tweets = await service.get({});

		expect(tweets).toHaveLength(0);
	});

	it('Can get', async () => {
		const tweet = createTweetDto();
		const insertedTweet = await service.create(tweet);

		const retrievedTweet = await service.getOne(insertedTweet.id);
		expect(retrievedTweet).toEqual(insertedTweet);
	});

	it('Can get by politician', async () => {
		const tweet1 = createTweetDto();
		const tweet2 = createTweetDto();
		const insertedTweet1 = await service.create(tweet1);
		await service.create(tweet2);

		const politicianTweets = await service.get({politician: tweet1.politicians[0]});

		expect(politicianTweets).toHaveLength(1);
		expect(politicianTweets[0].toObject()).toEqual(insertedTweet1.toObject());
	});

	it('Can get with limit and offset', async () => {
		const tweet1 = createTweetDto();
		const tweet2 = createTweetDto();
		const tweet3 = createTweetDto();

		tweet1.dateTime = new Date('Mon, 24 Aug 2020 21:18:41 GMT');
		tweet2.dateTime = new Date('Mon, 24 Aug 2020 21:18:42 GMT');
		tweet3.dateTime = new Date('Mon, 24 Aug 2020 21:18:43 GMT');

		await service.create(tweet1);

		await service.create(tweet2);
		await service.create(tweet3);

		const tweets = await service.get({limit: 2, offset: 1});
		expect(tweets).toHaveLength(2);

		expect(tweets[0].tweetId).toEqual(tweet2.tweetId);

		expect(tweets[1].tweetId).toEqual(tweet1.tweetId);
		expect(tweets[1].tweetText).toEqual(tweet1.tweetText);
	});

	it('Can delete one', async () => {
		const tweet = createTweetDto();
		const insertedTweet = await service.create(tweet);
		await service.deleteOne(insertedTweet.id);

		const retrievedTweet: DocumentDefinition<Tweet> = await service.getOne(insertedTweet.id);

		expect(retrievedTweet).toBeNull();
	});

	it('Can delete all', async () => {
		const tweet1 = createTweetDto();
		const tweet2 = createTweetDto();
		await Promise.all([
			service.create(tweet1),
			service.create(tweet2),
		]);

		await service.delete();

		const allTweets = await service.get({});
		expect(allTweets).toHaveLength(0);
	});

	it('Can update', async () => {
		const tweetDto = createTweetDto();
		const insertedTweet = (await service.create(tweetDto));
		insertedTweet.tweetText = 'New tweet text';

		await service.create(insertedTweet);

		const updatedTweet = await service.getOne(insertedTweet.id);

		expect(updatedTweet.toObject()).toEqual(insertedTweet.toObject());
	});

	it('Can upsert on tweet Id, new tweet inserted', async () => {
		const tweet = createTweetDto();

		const upsertedTweet = await service.create(tweet);

		const retrievedTweet = await service.getOne(upsertedTweet.id);
		expect(retrievedTweet).toEqual(upsertedTweet);
	});

	it('Can upsert on tweet Id, existing tweet updated', async () => {
		const tweet = createTweetDto();

		await service.create(tweet);
		let updatedTweet = createTweetDto() as any;
		updatedTweet.tweetId = tweet.tweetId;

		updatedTweet = await service.create(updatedTweet);

		const retrievedTweet = await service.getOne(updatedTweet.id);
		expect(retrievedTweet.toObject()).toEqual(updatedTweet.toObject());
	});

	it('Can upsert on tweetId, nothing changed', async () => {
		const tweet = createTweetDto();

		await service.create(tweet);
		const resultingTweet = await service.create(tweet);

		expect(resultingTweet.tweetText).toEqual(tweet.tweetText);
		expect(resultingTweet.tweetId).toEqual(tweet.tweetId);
	});
});
