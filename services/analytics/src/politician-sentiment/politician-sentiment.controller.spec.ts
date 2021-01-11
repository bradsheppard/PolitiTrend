import { Test, TestingModule } from '@nestjs/testing';
import { PoliticianSentimentController } from './politician-sentiment.controller';
import { getModelToken } from '@nestjs/mongoose';
import { PoliticianSentimentService } from './politician-sentiment.service';
import { PoliticianSentiment } from './interfaces/politician-sentiment.interface';
import { CreatePoliticianSentimentDto } from './dtos/create-politician-sentiment.dto';

describe('Sentiment Controller', () => {
    let controller: PoliticianSentimentController;
    let service: PoliticianSentimentService;

    let id = 0;

    function createSentiment(): PoliticianSentiment {
        id++;
        return {
            id,
            politician: id,
            sentiment: id,
            dateTime: new Date(),
            sampleSize: id + 100,
        } as PoliticianSentiment;
    }

    function createSentimentDto(): CreatePoliticianSentimentDto {
        id++;
        return {
            politician: id,
            sentiment: id,
            sampleSize: id + 100,
        };
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PoliticianSentimentController],
            providers: [
                PoliticianSentimentService,
                {
                    provide: getModelToken('PoliticianSentiment'),
                    useValue: {},
                },
            ],
        }).compile();

        controller = module.get<PoliticianSentimentController>(PoliticianSentimentController);
        service = module.get<PoliticianSentimentService>(PoliticianSentimentService);
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

    it('Can get by politician', async () => {
        const sentiment = createSentiment();
        jest.spyOn(service, 'find').mockResolvedValueOnce([sentiment]);
        expect(await controller.findAll({ politician: sentiment.politician })).toEqual([sentiment]);
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
