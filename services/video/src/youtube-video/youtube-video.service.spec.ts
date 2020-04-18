import { Test, TestingModule } from '@nestjs/testing';
import { YoutubeVideoService } from './youtube-video.service';
import { getModelToken } from '@nestjs/mongoose';
import { CreateYoutubeVideoDto } from './dtos/create-youtube-video.dto';

describe('YoutubeService', () => {
    let service: YoutubeVideoService;

    let id = 1;

    function createYoutubeVideoDto(): CreateYoutubeVideoDto {
        id++;
        return {
            thumbnail: `TestThumb${id}`,
            politicians: [id],
            title: `Title ${id}`,
            videoId: `Video${id}`,
            dateTime: new Date().toISOString()
        }
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

        static findOneAndUpdate() {
            return mockDocumentQuery;
        }

        static deleteMany() {
            return mockDocumentQuery;
        }
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                YoutubeVideoService,
                {
                    provide: getModelToken('YoutubeVideo'),
                    useValue: MockModel,
                },
            ],
        }).compile();

        service = module.get<YoutubeVideoService>(YoutubeVideoService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
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
        await service.find({ limit: 1 });
        expect(findSpy).toBeCalledWith(1);
    });

    it('can insert', async () => {
        const createDto = createYoutubeVideoDto();
        const findOneAndUpdateSpy = jest.fn();
        findOneAndUpdateSpy.mockReturnValue(mockDocumentQuery);
        MockModel.findOneAndUpdate = findOneAndUpdateSpy;
        await service.create(createDto);

        expect(findOneAndUpdateSpy).toBeCalled();
    });
});
