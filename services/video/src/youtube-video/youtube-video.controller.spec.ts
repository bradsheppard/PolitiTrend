import { Test, TestingModule } from '@nestjs/testing';
import { YoutubeVideoController } from './youtube-video.controller';
import { getModelToken } from '@nestjs/mongoose';
import { YoutubeVideoService } from './youtube-video.service';
import { YoutubeVideo } from './interfaces/youtube-video.interface';

describe('Youtube Controller', () => {
    let controller: YoutubeVideoController;
    let service: YoutubeVideoService;

    let id = 1;

    function createYoutubeVideo(): YoutubeVideo {
        id++;
        return {
            videoId: `Test id ${id}`,
            title: `Test title ${id}`
        } as YoutubeVideo
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [YoutubeVideoController],
            providers: [
                YoutubeVideoService,
                {
                    provide: getModelToken('YoutubeVideo'),
                    useValue: {}
                }
            ]
        }).compile();

        controller = module.get<YoutubeVideoController>(YoutubeVideoController);
        service = module.get<YoutubeVideoService>(YoutubeVideoService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });

    it('Can get all', async () => {
        const youtubeVideo = createYoutubeVideo();
        jest.spyOn(service, 'find').mockResolvedValueOnce([youtubeVideo]);
        expect(await controller.findAll({})).toEqual([youtubeVideo]);
    });

    it('Can handle word cloud created', async () => {
        const youtubeVideo = createYoutubeVideo();
        const insertSpy = jest.spyOn(service, 'create').mockImplementation();
        await controller.handleYoutubeVideoCreated(youtubeVideo);
        expect(insertSpy).toBeCalled();
    });

    it('Can delete', async() => {
        const deleteSpy = jest.spyOn(service, 'delete').mockImplementation();
        await controller.delete();
        expect(deleteSpy).toBeCalled();
    });

    it('Can create word cloud', async() => {
        const createDto = createYoutubeVideo();
        const insertSpy = jest.spyOn(service, 'create').mockImplementation();
        await controller.create(createDto);
        expect(insertSpy).toBeCalled();
    });
});
