import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateTweetDto } from '../src/tweet/dto/create-tweet.dto';
import Tweet from '../src/tweet/tweet.entity';
import { TweetService } from '../src/tweet/tweet.service';
import { ClientProxy, ClientsModule } from '@nestjs/microservices';
import microserviceConfig from '../src/config/config.microservice';
import { ClientProviderOptions } from '@nestjs/microservices/module/interfaces/clients-module.interface';
import waitForExpect from 'wait-for-expect';
import { UpdateTweetDto } from '../src/tweet/dto/update-tweet.dto';

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
		dateTime: new Date().toUTCString(),
		sentiments: [
			{
				politician: id,
				value: id,
			},
		],
	} as CreateTweetDto;
}

function createTweetDtoForPolitician(politicianId: number) {
	id++;
	return {
		tweetId: id.toString(),
		tweetText: `Test tweet ${id}`,
		dateTime: new Date().toUTCString(),
		sentiments: [
			{
				politician: politicianId,
				value: id,
			},
		],
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

	it('/ (GET)', async () => {
		const response = await request(app.getHttpServer())
		  .get('/');

		expect(response.status).toEqual(200);
	});

	it('/ (POST)', async () => {
		const tweetDto = createTweetDto();
		const res = await request(app.getHttpServer())
			.post('/')
			.send(tweetDto);

		const resultingTweet = res.body as Tweet;
		const insertedTweet = tweetDto as Tweet;
		insertedTweet.id = resultingTweet.id;
		insertedTweet.sentiments[0].id = resultingTweet.sentiments[0].id;

		expect(res.status).toEqual(201);
		expect(resultingTweet).toEqual(insertedTweet);
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
			const tweets: Tweet[] = await service.get({});
			expect(tweets.length).toEqual(1);
		});
	});
});

describe('TweetService (e2e)', () => {

	it('Can get all', async () => {
		const tweet1 = createTweetDto();
		const tweet2 = createTweetDto();

		const firstInsert = await service.insert(tweet1);
		const secondInsert = await service.insert(tweet2);

		const tweets = await service.get();

		expect(tweets).toEqual([firstInsert, secondInsert]);
	});

	it('Can get when nothing exists', async () => {
		const tweets = await service.get();

		expect(tweets).toHaveLength(0);
	});

	it('Can get', async () => {
		const tweet = createTweetDto();
		const insertedTweet = await service.insert(tweet);

		const retrievedTweet = await service.getOne(insertedTweet.id);
		expect(retrievedTweet).toEqual(insertedTweet);
	});

	it('Can get by politician', async () => {
		const tweet1 = createTweetDto();
		const tweet2 = createTweetDto();
		const insertedTweet1 = await service.insert(tweet1);
		await service.insert(tweet2);

		const politicianTweets = await service.get({politicians: [insertedTweet1.sentiments[0].politician]});

		expect(politicianTweets).toHaveLength(1);
		for (const tweet of politicianTweets) {
			expect(tweet.sentiments[0].politician).toEqual(insertedTweet1.sentiments[0].politician);
		}
	});

	it('Can get with limit and offset', async () => {
		const tweet1 = createTweetDto();
		const tweet2 = createTweetDto();
		const tweet3 = createTweetDto();

		await service.insert(tweet1);

		await service.insert(tweet2);
		await service.insert(tweet3);

		const tweets = await service.get({limit: 2, offset: 1});
		expect(tweets).toHaveLength(2);

		expect(tweets[0].tweetId).toEqual(tweet2.tweetId);
		expect(tweets[0].tweetText).toEqual(tweet2.tweetText);

		expect(tweets[1].tweetId).toEqual(tweet3.tweetId);
		expect(tweets[1].tweetText).toEqual(tweet3.tweetText);
	});

	it('Can get with limit per politician', async () => {
		const tweet1Politician1 = createTweetDtoForPolitician(1);
		const tweet2Politician1 = createTweetDtoForPolitician(1);
		const tweet3Politician1 = createTweetDtoForPolitician(1);

		const tweet1Politician2 = createTweetDtoForPolitician(2);
		const tweet2Politician2 = createTweetDtoForPolitician(2);
		const tweet3Politician2 = createTweetDtoForPolitician(2);

		await Promise.all([
			service.insert(tweet1Politician1),
			service.insert(tweet2Politician1),
			service.insert(tweet3Politician1),

			service.insert(tweet1Politician2),
			service.insert(tweet2Politician2),
			service.insert(tweet3Politician2),
		]);

		const tweets = await service.get({limitPerPolitician: 2});

		const politician1Tweets = tweets.filter(x => x.sentiments[0].politician === 1);
		const politician2Tweets = tweets.filter(x => x.sentiments[0].politician === 2);

		expect(politician1Tweets).toHaveLength(2);
		expect(politician2Tweets).toHaveLength(2);
	});

	it('Can delete one', async () => {
		const tweet = createTweetDto();
		const insertedTweet = await service.insert(tweet);
		await service.deleteOne(insertedTweet.id);

		const retrievedTweet: Tweet | null = await service.getOne(insertedTweet.id);

		expect(retrievedTweet).toBeNull();
	});

	it('Can delete all', async () => {
		const tweet1 = createTweetDto();
		const tweet2 = createTweetDto();
		await Promise.all([
			service.insert(tweet1),
			service.insert(tweet2),
		]);

		await service.delete();

		const allTweets = await service.get();
		expect(allTweets).toHaveLength(0);
	});

	it('Can update', async () => {
		const tweetDto = createTweetDto();
		const insertedTweet = (await service.insert(tweetDto)) as UpdateTweetDto;
		insertedTweet.tweetText = 'New tweet text';

		await service.update(insertedTweet);

		const updatedTweet = await service.getOne(insertedTweet.id);

		expect(updatedTweet).toEqual(insertedTweet);
	});

	it('Can upsert on tweet Id, new tweet inserted', async () => {
		const tweet = createTweetDto();

		const upsertedTweet = await service.upsertOnTweetId(tweet);

		const retrievedTweet = await service.getOne(upsertedTweet.id);
		expect(retrievedTweet).toEqual(upsertedTweet);
	});

	it('Can upsert on tweet Id, existing tweet updated', async () => {
		const tweet = createTweetDto();

		await service.upsertOnTweetId(tweet);
		const updatedTweet = createTweetDto() as any;
		updatedTweet.tweetId = tweet.tweetId;

		const resultingTweet = await service.upsertOnTweetId(updatedTweet);
		updatedTweet.id = resultingTweet.id;
		updatedTweet.sentiments[0].id = resultingTweet.sentiments[0].id;

		const retrievedTweet = await service.getOne(resultingTweet.id);
		expect(retrievedTweet).toEqual(updatedTweet);
	});

	it('Can upsert on tweetId, sentiments updated', async () => {
		const tweet = createTweetDto() as any;

		const insertedTweet = await service.upsertOnTweetId(tweet);
		tweet.sentiments = [
			{
				politician: 45,
				value: 4.5,
			},
		];

		await service.upsertOnTweetId(tweet);

		const retrievedTweet = await service.getOne(insertedTweet.id);
		tweet.sentiments[0].id = retrievedTweet.sentiments[0].id;

		expect(retrievedTweet.tweetText).toEqual(tweet.tweetText);
		expect(retrievedTweet.sentiments).toEqual(tweet.sentiments);
	});

	it('Can upsert on tweetId, nothing changed', async () => {
		const tweet = createTweetDto();

		await service.upsertOnTweetId(tweet);
		const resultingTweet = await service.upsertOnTweetId(tweet);

		expect(resultingTweet.tweetText).toEqual(tweet.tweetText);
		expect(resultingTweet.tweetId).toEqual(tweet.tweetId);
	});

	it('Can upsert with no sentiments, no exceptions', async () => {
		const tweet = createTweetDto();
		tweet.sentiments = [];

		await service.upsertOnTweetId(tweet);
		const resultingTweet = await service.upsertOnTweetId(tweet);

		expect(resultingTweet.sentiments).toHaveLength(0);
	});
});