import { Test, TestingModule } from '@nestjs/testing';
import { TweetService } from './tweet.service';
import { getConnectionToken, getRepositoryToken } from '@nestjs/typeorm';
import Tweet from './tweet.entity';
import { Repository } from 'typeorm';
import { Sentiment } from '../../sentiment/sentiment.entity';

describe('Tweet Service', () => {
	let service: TweetService;
	let tweetRepository: Repository<Tweet>;
	let sentimentRepository: Repository<Sentiment>;

	let id = 0;

	function createOpinion() {
		id++;
		return {
			tweetText: `test text ${id}`,
			tweetId: id.toString(),
			sentiments: [
				{
					politician: id,
					value: id,
				},
			],
		} as Tweet;
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [TweetService,
				{
					provide: getConnectionToken(),
					useValue: {},
				},
				{
					provide: getRepositoryToken(Tweet),
					useClass: Repository,
				},
				{
					provide: getRepositoryToken(Sentiment),
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<TweetService>(TweetService);
		tweetRepository = module.get<Repository<Tweet>>(getRepositoryToken(Tweet));
		sentimentRepository = module.get<Repository<Sentiment>>(getRepositoryToken(Sentiment));
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(tweetRepository).toBeDefined();
	});

	it('can get all', async () => {
		const opinion = createOpinion();
		jest.spyOn(tweetRepository, 'find').mockResolvedValueOnce([opinion]);
		expect(await service.get()).toEqual([opinion]);
	});

	it('can get one', async () => {
		const opinion = createOpinion();
		jest.spyOn(tweetRepository, 'findOne').mockResolvedValueOnce(opinion);
		expect(await service.getOne(opinion.id)).toEqual(opinion);
	});

	it('can delete', async () => {
		const deleteSpy = jest.spyOn(tweetRepository, 'delete').mockImplementation();
		await service.delete();
		expect(deleteSpy).toBeCalled();
	});

	it('can update', async () => {
		const opinion = createOpinion();

		const tweetFindSpy = jest.spyOn(tweetRepository, 'findOne').mockResolvedValueOnce(opinion);
		const tweetSaveSpy = jest.spyOn(tweetRepository, 'save').mockResolvedValueOnce(opinion);
		const tweetCreateSpy = jest.spyOn(tweetRepository, 'create').mockReturnValue(opinion);

		const sentimentCreateSpy = jest.spyOn(sentimentRepository, 'create').mockReturnValue(opinion.sentiments[0]);
		const sentimentSaveSpy = jest.spyOn(sentimentRepository, 'save').mockResolvedValueOnce(opinion.sentiments[0]);

		await service.update(opinion);

		expect(tweetSaveSpy).toBeCalledWith(opinion);
		expect(tweetFindSpy).toBeCalledWith(opinion.id);
		expect(tweetCreateSpy).toBeCalled();

		expect(sentimentCreateSpy).toBeCalledWith(opinion.sentiments[0]);
		expect(sentimentSaveSpy).toBeCalledWith(opinion.sentiments[0]);
	});
});
