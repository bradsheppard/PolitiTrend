import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateTweetDto } from '../src/opinion/tweet/dto/create-tweet.dto';
import Tweet from '../src/opinion/tweet/tweet.entity';
import { TweetService } from '../src/opinion/tweet/tweet.service';
import { ClientProxy, ClientsModule } from '@nestjs/microservices';
import microserviceConfig from '../src/config/config.microservice';
import { ClientProviderOptions } from '@nestjs/microservices/module/interfaces/clients-module.interface';
import waitForExpect from 'wait-for-expect';
import { UpdateTweetDto } from '../src/opinion/tweet/dto/update-tweet.dto';
import { create } from 'ts-node';
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
		  .get('/tweet');

		expect(response.status).toEqual(200);
	});

	it('/ (POST)', async () => {
		const tweetDto = createTweetDto();
		const res = await request(app.getHttpServer())
			.post('/tweet')
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
			.post('/tweet')
			.send(tweetDto);

		const resultingTweet = postResponse.body as Tweet;
		const getResponse = await request(app.getHttpServer())
			.get(`/tweet/${resultingTweet.id}`);

		expect(getResponse.status).toEqual(200);
		expect(getResponse.body).toEqual(resultingTweet);
	});

	it('/:id (DELETE)', async () => {
		const tweetDto = createTweetDto();
		const postResponse = await request(app.getHttpServer())
			.post('/tweet')
			.send(tweetDto);

		const resultingTweet = postResponse.body as Tweet;

		const deleteResponse = await request(app.getHttpServer())
			.delete(`/tweet/${resultingTweet.id}`);
		const getResponse = await request(app.getHttpServer())
			.get(`/tweet/${resultingTweet.id}`);

		expect(deleteResponse.status).toEqual(200);
		expect(getResponse.status).toEqual(404);
	});

	it('/ (DELETE)', async () => {
		const tweet1 = createTweetDto();
		const tweet2 = createTweetDto();
		await Promise.all([
			request(app.getHttpServer()).post('/tweet').send(tweet1),
			request(app.getHttpServer()).post('/tweet').send(tweet2),
		]);

		const deleteResponse = await request(app.getHttpServer()).delete('/tweet');
		const getResponse = await request(app.getHttpServer()).get('/tweet');

		const tweets = getResponse.body as Tweet[];

		expect(deleteResponse.status).toEqual(200);
		expect(getResponse.status).toEqual(200);
		expect(tweets).toHaveLength(0);
	});

	it('handle tweet created', async () => {
		const tweetDto = createTweetDto();
		const json = await client.emit('tweet_created', tweetDto).toPromise();

		expect(json[0].topicName).toEqual('tweet_created');

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

		const tweets = await service.get({});

		expect(tweets).toEqual([firstInsert, secondInsert]);
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

		const politicianTweets = await service.get({politician: insertedTweet1.sentiments[0].politician});

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

		await Promise.all([
			service.insert(tweet2),
			service.insert(tweet3),
		]);

		const tweets = await service.get({limit: 2, offset: 1});
		expect(tweets).toHaveLength(2);

		expect(tweets[0].tweetId).toEqual(tweet2.tweetId);
		expect(tweets[0].tweetText).toEqual(tweet2.tweetText);

		expect(tweets[1].tweetId).toEqual(tweet3.tweetId);
		expect(tweets[1].tweetText).toEqual(tweet3.tweetText);
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

		const updateTweetDto = await service.insert(tweet) as UpdateTweetDto;
		updateTweetDto.tweetText = 'Some new text';

		await service.upsertOnTweetId(updateTweetDto);

		const retrievedTweet = await service.getOne(updateTweetDto.id);
		expect(retrievedTweet).toEqual(updateTweetDto);
	});

	it('Can upsert on tweetId, sentiments updated', async () => {
		const tweet = createTweetDto();

		const insertedTweet = await service.insert(tweet);
		tweet.sentiments = [
			{
				politician: 45,
				value: 4.5,
			},
		];

		await service.upsertOnTweetId(tweet);

		const retrievedTweet = await service.getOne(insertedTweet.id);
		expect(retrievedTweet.tweetText).toEqual(tweet.tweetText);
		expect(retrievedTweet.sentiments).toEqual(tweet.sentiments);
	});
});
