import { Test, TestingModule } from '@nestjs/testing';
import { GlobalWordCloudController } from './global-word-cloud.controller';
import { GlobalWordCloudService } from './global-word-cloud.service';
import { getModelToken } from '@nestjs/mongoose';
import { GlobalWordCloud } from './interfaces/global-word-cloud.interface';
import { CreateGlobalWordCloudDto } from './dtos/create-global-word-cloud.dto';

describe('WordCloud Controller', () => {
    let controller: GlobalWordCloudController;
    let service: GlobalWordCloudService;

    let id = 1;

    function createWordCloud(): GlobalWordCloud {
        id++;
        return {
            words: [
                {
                    word: `Test word ${id}`,
                    count: id,
                },
            ],
        } as GlobalWordCloud;
    }

    function createWordCloudDto(): CreateGlobalWordCloudDto {
        id++;
        return {
            words: [
                {
                    word: `Test word ${id}`,
                    count: id,
                },
            ],
        };
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GlobalWordCloudController],
            providers: [
                GlobalWordCloudService,
                {
                    provide: getModelToken('GlobalWordCloud'),
                    useValue: {},
                },
            ],
        }).compile();

        controller = module.get<GlobalWordCloudController>(GlobalWordCloudController);
        service = module.get<GlobalWordCloudService>(GlobalWordCloudService);
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
        await controller.handleGlobalWordCloudCreated(wordCloud);
        expect(insertSpy).toBeCalled();
    });

    it('Can create word cloud', async () => {
        const createDto = createWordCloudDto();
        const insertSpy = jest.spyOn(service, 'create').mockImplementation();
        await controller.create(createDto);
        expect(insertSpy).toBeCalled();
    });
});
