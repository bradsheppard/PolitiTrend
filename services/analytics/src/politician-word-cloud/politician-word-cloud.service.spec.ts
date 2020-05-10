import { Test, TestingModule } from '@nestjs/testing';
import { PoliticianWordCloudService } from './politician-word-cloud.service';
import { getModelToken } from '@nestjs/mongoose';
import { PoliticianWordCloud } from './interfaces/politician-word-cloud.interface';

describe('WordCloudService', () => {
	let service: PoliticianWordCloudService;

	let id = 1;

	function createWordCloud(): PoliticianWordCloud {
		id++;
		return {
			politician: id,
			words: [{
				word: `Test word ${id}`,
				count: id
			}]
		} as PoliticianWordCloud
	}

	class MockDocument {
		save() {return;}
	}

	class MockDocumentQuery {
		constructor(private readonly wordCloud) {}
		sort() { return this; }
		exec() { return [this.wordCloud]}
	}

	const mockDocument = new MockDocument();

	class MockModel {
		static find(wordcloud) {
			return new MockDocumentQuery(wordcloud);
		}
		constructor() {
			return mockDocument
		}
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PoliticianWordCloudService,
                {
                    provide: getModelToken('PoliticianWordCloud'),
                    useValue: MockModel
                }
			],
		}).compile();

		service = module.get<PoliticianWordCloudService>(PoliticianWordCloudService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('can get all', async () => {
		const wordCloud = createWordCloud();
		const findSpy = jest.spyOn(MockModel, 'find');
		await service.find(wordCloud);
		expect(findSpy).toBeCalledWith({politician: wordCloud.politician});
	});

	it('can insert', async () => {
		const wordCloud = createWordCloud();
		const saveSpy = jest.spyOn(mockDocument, 'save').mockImplementation();
		await service.create(wordCloud);

		expect(saveSpy).toBeCalled();
	});
});
