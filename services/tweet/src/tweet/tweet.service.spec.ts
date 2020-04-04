import { Test, TestingModule } from '@nestjs/testing';
import { TweetService } from './tweet.service';
import { getConnectionToken, getRepositoryToken } from '@nestjs/typeorm';
import Tweet from './tweet.entity';
import { Repository } from 'typeorm';

describe('Tweet Service', () => {
	let service: TweetService;
	let tweetRepository: Repository<Tweet>;

	let id = 0;

	function createOpinion() {
		id++;
		return {
			tweetText: `test text ${id}`,
			tweetId: id.toString(),
			politicians: [id]
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
			],
		}).compile();

		service = module.get<TweetService>(TweetService);
		tweetRepository = module.get<Repository<Tweet>>(getRepositoryToken(Tweet));
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

		await service.update(opinion);

		expect(tweetSaveSpy).toBeCalledWith(opinion);
		expect(tweetFindSpy).toBeCalledWith(opinion.id);
		expect(tweetCreateSpy).toBeCalled();
	});
});
