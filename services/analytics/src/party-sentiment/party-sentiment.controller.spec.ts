import { Test, TestingModule } from '@nestjs/testing';
import { PartySentimentController } from './party-sentiment.controller';
import { getModelToken } from '@nestjs/mongoose';
import { PartySentimentService } from './party-sentiment.service';
import { PartySentiment } from './interfaces/party-sentiment.interface';
import { CreatePartySentimentDto } from './dtos/create-party-sentiment.dto';

describe('Sentiment Controller', () => {
	let controller: PartySentimentController;
	let service: PartySentimentService;

	let id = 0;

	function createSentiment(): PartySentiment {
		id++;
		return {
			id,
			party: `Test party ${id}`,
			sentiment: id,
			dateTime: new Date(),
			sampleSize: id + 100,
		} as PartySentiment;
	}

	function createSentimentDto(): CreatePartySentimentDto {
		id++;
		return {
			party: `Test party ${id}`,
			sentiment: id,
			sampleSize: id + 100,
		};
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PartySentimentController],
			providers: [
				PartySentimentService,
				{
					provide: getModelToken('PartySentiment'),
					useValue: {},
				},
			],
		}).compile();

		controller = module.get<PartySentimentController>(PartySentimentController);
		service = module.get<PartySentimentService>(PartySentimentService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
		expect(service).toBeDefined();
	});

	it('Can get all', async () => {
		const sentiment = createSentiment();
		jest.spyOn(service, 'find').mockResolvedValueOnce([sentiment]);
		expect(await controller.findAll({})).toEqual([sentiment]);
	});

	it('Can get by party', async () => {
		const sentiment = createSentiment();
		jest.spyOn(service, 'find').mockResolvedValueOnce([sentiment]);
		expect(await controller.findAll({ party: sentiment.party })).toEqual([sentiment]);
	});

	it('Can handle sentiment created', async () => {
		const sentiment = createSentiment();
		const insertSpy = jest.spyOn(service, 'create').mockImplementation();
		await controller.handleSentimentCreated(sentiment);
		expect(insertSpy).toBeCalled();
	});

	it('Can create sentiment', async () => {
		const createDto = createSentimentDto();
		const insertSpy = jest.spyOn(service, 'create').mockImplementation();
		await controller.create(createDto);
		expect(insertSpy).toBeCalled();
	});
});
