import { Test, TestingModule } from '@nestjs/testing';
import { WordCloudService } from './word-cloud.service';
import { getModelToken } from '@nestjs/mongoose';
import { WordCloud } from './interfaces/word-cloud.interface';

describe('WordCloudService', () => {
	let service: WordCloudService;

	let id = 1;

	function createWordCloud(): WordCloud {
		id++;
		return {
			politician: id,
			words: [{
				word: `Test word ${id}`,
				count: id
			}]
		} as WordCloud
	}

	class MockDocument {
		save() {return;}
	}

	const mockDocument = new MockDocument();

	class MockModel {
		static find(wordCloud) {
			return {
				exec() {return [wordCloud]}
			}
		}
		constructor() {
			return mockDocument
		}
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				WordCloudService,
                {
                    provide: getModelToken('WordCloud'),
                    useValue: MockModel
                }
			],
		}).compile();

		service = module.get<WordCloudService>(WordCloudService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('can get all', async () => {
		const wordCloud = createWordCloud();
		expect(await service.find(wordCloud)).toEqual([wordCloud]);
	});

	it('can insert', async () => {
		const wordCloud = createWordCloud();
		const saveSpy = jest.spyOn(mockDocument, 'save').mockImplementation();
		await service.create(wordCloud);

		expect(saveSpy).toBeCalled();
	});
});
