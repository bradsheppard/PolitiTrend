import { Test, TestingModule } from '@nestjs/testing';
import { WordCloudController } from './word-cloud.controller';
import { WordCloudService } from './word-cloud.service';
import { getModelToken } from '@nestjs/mongoose';
import { WordCloud } from './interfaces/word-cloud.interface';
import { CreateWordCloudDto } from './dto/create-word-cloud.dto';

describe('WordCloud Controller', () => {
	let controller: WordCloudController;
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

	function createWordCloudDto(): CreateWordCloudDto {
		id++;
		return {
			politician: id,
			words: [{
				word: `Test word ${id}`,
				count: id
			}]
		}
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [WordCloudController],
			providers: [
				WordCloudService,
				{
					provide: getModelToken('WordCloud'),
					useValue: {}
				}
			]
		}).compile();

		controller = module.get<WordCloudController>(WordCloudController);
		service = module.get<WordCloudService>(WordCloudService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('Can get all', async () => {
		const wordCloud = createWordCloud();
		jest.spyOn(service, 'find').mockResolvedValueOnce([wordCloud]);
		expect(await controller.findAll({})).toEqual([wordCloud]);
	});

	it('Can handle word cloud created', async () => {
		const wordCloud = createWordCloud();
		const insertSpy = jest.spyOn(service, 'create').mockImplementation();
		await controller.handleWordCloudCreated(wordCloud);
		expect(insertSpy).toBeCalled();
	});

	it('Can create word cloud', async() => {
		const createDto = createWordCloudDto();
		const insertSpy = jest.spyOn(service, 'create').mockImplementation();
		await controller.create(createDto);
		expect(insertSpy).toBeCalled();
	});
});
