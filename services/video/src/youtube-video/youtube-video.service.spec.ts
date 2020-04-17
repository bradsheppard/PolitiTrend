import { Test, TestingModule } from '@nestjs/testing';
import { YoutubeVideoService } from './youtube-video.service';
import { getModelToken } from '@nestjs/mongoose';
import { YoutubeVideo } from './interfaces/youtube-video.interface';

describe('YoutubeService', () => {
    let service: YoutubeVideoService;

    let id = 1;

    function createYoutubeVideo(): YoutubeVideo {
        id++;
        return {
            videoId: `Test id ${id}`,
            title: `Test title ${id}`
        } as YoutubeVideo
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
        const youtubeVideo = createYoutubeVideo();
        const saveSpy = jest.spyOn(mockDocument, 'save').mockImplementation();
        await service.create(youtubeVideo);

        expect(saveSpy).toBeCalled();
    });
});
