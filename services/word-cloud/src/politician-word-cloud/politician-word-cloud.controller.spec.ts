import { Test, TestingModule } from '@nestjs/testing';
import { PoliticianWordCloudController } from './politician-word-cloud.controller';
import { PoliticianWordCloudService } from './politician-word-cloud.service';
import { getModelToken } from '@nestjs/mongoose';
import { PoliticianWordCloud } from './interfaces/politician-word-cloud.interface';
import { CreatePoliticianWordCloudDto } from './dtos/create-politician-word-cloud.dto';

describe('WordCloud Controller', () => {
	let controller: PoliticianWordCloudController;
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

	function createWordCloudDto(): CreatePoliticianWordCloudDto {
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
			controllers: [PoliticianWordCloudController],
			providers: [
				PoliticianWordCloudService,
				{
					provide: getModelToken('PoliticianWordCloud'),
					useValue: {}
				}
			]
		}).compile();

		controller = module.get<PoliticianWordCloudController>(PoliticianWordCloudController);
		service = module.get<PoliticianWordCloudService>(PoliticianWordCloudService);
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
