import { Test, TestingModule } from '@nestjs/testing';
import { GlobalWordCloudService } from './global-word-cloud.service';
import { getModelToken } from '@nestjs/mongoose';
import { GlobalWordCloud } from './interfaces/global-word-cloud.interface';

describe('WordCloudService', () => {
	let service: GlobalWordCloudService;

	let id = 1;

	function createWordCloud(): GlobalWordCloud {
		id++;
		return {
			words: [{
				word: `Test word ${id}`,
				count: id,
			}],
		} as GlobalWordCloud;
	}

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
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GlobalWordCloudService,
				{
					provide: getModelToken('GlobalWordCloud'),
					useValue: MockModel,
				},
			],
		}).compile();

		service = module.get<GlobalWordCloudService>(GlobalWordCloudService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('can get all', async () => {
		const findSpy = jest.spyOn(mockDocumentQuery, 'limit');
		await service.find({ limit: 1 });
		expect(findSpy).toBeCalledWith(1);
	});

	it('can insert', async () => {
		const wordCloud = createWordCloud();
		const saveSpy = jest.spyOn(mockDocument, 'save').mockImplementation();
		await service.create(wordCloud);

		expect(saveSpy).toBeCalled();
	});
});
