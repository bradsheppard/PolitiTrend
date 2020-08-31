import { Test, TestingModule } from '@nestjs/testing';
import { TweetService } from './tweet.service';
import { Tweet } from './schemas/tweet.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('Tweet Service', () => {
	let service: TweetService;
	let tweetModel: Model<Tweet>;

	let id = 0;

	function createTweet() {
		id++;
		return {
			tweetText: `test text ${id}`,
			tweetId: id.toString(),
			politicians: [id],
			location: `Test location ${id}`
		} as Tweet;
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [TweetService,
				{
					provide: getModelToken('Tweet'),
					useValue: MockModel,
				}
			],
		}).compile();

		service = module.get<TweetService>(TweetService);
		tweetModel = module.get<Model<Tweet>>(getModelToken('Tweet'));
	});

	class MockDocument {
		save() {
			return;
		}
	}

	class MockDocumentQuery {
		sort() {
			return this;
		}

		limit() {
			return this;
		}

		exec() {
			return [];
		}
	}

	const mockDocument = new MockDocument();
	const mockDocumentQuery = new MockDocumentQuery();

	class MockModel {
		constructor() {
			return mockDocument;
		}

		static find() {
			return mockDocumentQuery;
		}

		static findOneAndUpdate() {
			return mockDocumentQuery;
		}

		static deleteMany() {
			return mockDocumentQuery;
		}
	}

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(tweetModel).toBeDefined();
	});

	it('Can delete', async () => {
		const mockDeleteMany = jest.fn();
		mockDeleteMany.mockReturnValueOnce(mockDocumentQuery);

		MockModel.deleteMany = mockDeleteMany;
		await service.delete();
		expect(mockDeleteMany).toBeCalled();
	});

	it('can get all', async () => {
		const findSpy = jest.spyOn(mockDocumentQuery, 'limit');
		await service.get({ limit: 1 });
		expect(findSpy).toBeCalledWith(1);
	});

	it('can insert', async () => {
		const createDto = createTweet();
		const findOneAndUpdateSpy = jest.fn();
		findOneAndUpdateSpy.mockReturnValue(mockDocumentQuery);
		MockModel.findOneAndUpdate = findOneAndUpdateSpy;
		await service.create(createDto);

		expect(findOneAndUpdateSpy).toBeCalled();
	});
});
