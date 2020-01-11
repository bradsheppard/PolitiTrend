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
waitForExpect.defaults.timeout = 20000;
jest.setTimeout(60000);

let app: INestApplication;
let service: TweetService;
let client: ClientProxy;

let id = 0;

function createTweetDto() {
	id++;
	return {
		tweetId: id.toString(),
		tweetText: `Test tweet ${id}`,
		sentiments: []
	} as CreateTweetDto;
}

function createTweetForPolitician(politicianId: number, sentiment: number) {
	id++;
	return {
		tweetText: `test text ${id}`,
		tweetId: id.toString(),
		sentiments: [
			{
				politician: politicianId,
				sentiment: sentiment
			}
		]
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
	await app.close();
	await client.close();
});

beforeEach(async () => {
	await service.delete();
});

afterEach(() => {
	jest.resetAllMocks();
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

	it('handle tweet created', async () => {
		const tweetDto = createTweetDto();
		const json = await client.emit('tweet_created', tweetDto).toPromise();

		expect(json[0].topicName).toEqual('tweet_created');

		await waitForExpect(async () => {
			const tweets: Tweet[] = await service.get();
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

		const Tweets = await service.get({});

		expect(Tweets).toEqual([firstInsert, secondInsert]);
	});

	it('Can get', async () => {
		const tweet = createTweetDto() as Tweet;
		const insertedTweet = await service.insert(tweet);
		tweet.id = insertedTweet.id;

		const retrievedTweet = await service.getOne(insertedTweet.id);
		expect(retrievedTweet).toEqual(insertedTweet);
		expect(insertedTweet).toEqual(tweet);
	});

	it('Can get by politician', async () => {
		const tweet1 = createTweetDto();
		const tweet2 = createTweetDto();
		const insertedTweet1 = await service.insert(tweet1);
		await service.insert(tweet2);

		const politicianTweets = await service.get({politician: insertedTweet1.sentiments[0].politician});

		for (const tweet of politicianTweets) {
			expect(tweet.sentiments[0].politician).toEqual(insertedTweet1.sentiments[0].politician);
		}
	});

	it('Can delete', async () => {
		const tweet = createTweetDto();
		const insertedTweet = await service.insert(tweet);
		await service.deleteOne(insertedTweet.id);

		const tweets: Tweet[] = await service.get({id: insertedTweet.id});

		expect(tweets).toHaveLength(0);
	});

	it('Can update', async () => {
		const tweet = createTweetDto();
		const insertedTweet = await service.insert(tweet);
		insertedTweet.tweetText = 'New tweet text';
		await service.update(insertedTweet);

		const updatedTweet = await service.getOne(insertedTweet.id);

		expect(updatedTweet).toEqual(insertedTweet);
	});

	it('Can upsert on tweet Id, new tweet inserted', async () => {
		const tweet = createTweetDto();

		const upsertedTweet = await service.upsertOnTweetId(tweet);

		const retrievedTweet = await service.getOne(upsertedTweet.id);
		expect(retrievedTweet).toEqual(tweet);
	});

	it('Can upsert on tweet Id, existing tweet updated', async () => {
		const tweet = createTweetDto();

		const insertedTweet = await service.insert(tweet);
		insertedTweet.tweetText = 'Some new text';

		await service.upsertOnTweetId(insertedTweet);

		const retrievedTweet = await service.getOne(insertedTweet.id);
		expect(retrievedTweet).toEqual(insertedTweet);
	});

	it('Can get sentiment average', async () => {
		const testTweet1 = createTweetForPolitician(60, 6.5);
		const testTweet2 = createTweetForPolitician(60, 9);

		await service.insert(testTweet1);
		await service.insert(testTweet2);

		const averageSentiment = await service.getSentimentAverageForPolitician(60);
		expect(averageSentiment).toEqual(7.75);
	});

	it('Can get sentiment average, nonexistent politician', async () => {
		const testTweet1 = createTweetForPolitician(62, 6.5);
		const testTweet2 = createTweetForPolitician(62, 9);

		await service.insert(testTweet1);
		await service.insert(testTweet2);

		const averageSentiment = await service.getSentimentAverageForPolitician(999);
		expect(averageSentiment).toBeNull();
	});

	it('Can get sentiment average when no politicians', async () => {
		await service.delete();

		const averageSentiment = await service.getSentimentAverageForPolitician(1);
		expect(averageSentiment).toBeNull();
	});
});
