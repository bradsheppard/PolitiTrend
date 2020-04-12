import microserviceConfig from '../src/config/config.microservice';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ClientProviderOptions } from '@nestjs/microservices/module/interfaces/clients-module.interface';
import { ClientProxy, ClientsModule } from '@nestjs/microservices';
import { AppModule } from '../src/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import { YoutubeVideoService } from '../src/youtube-video/youtube-video.service';
import { CreateYoutubeVideoDto } from '../src/youtube-video/dtos/create-youtube-video.dto';
import * as request from 'supertest';
import { YoutubeVideo } from '../src/youtube-video/interfaces/youtube-video.interface';
import waitForExpect from 'wait-for-expect';

let client: ClientProxy;
let app: INestApplication;

let service: YoutubeVideoService;

jest.setTimeout(120000);

beforeAll(async () => {
    const name = {
        name: 'YOUTUBE_VIDEO_SERVICE',
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
            AppModule,
            ClientsModule.register([
                {
                    ...microserviceConfig,
                    ...name,
                } as ClientProviderOptions,
            ]),
        ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({transform: true, skipMissingProperties: true}));
    app.connectMicroservice(microserviceConfig);

    service = moduleFixture.get<YoutubeVideoService>(YoutubeVideoService);
    client = app.get('YOUTUBE_VIDEO_SERVICE');

    await app.init();
    await app.startAllMicroservicesAsync();

    await client.connect();
});

afterAll(async () => {
    await client.close();
    await app.close();
});

beforeEach(async () => {
    await service.delete();
});

let id = 1;

function createYoutubeVideo(): CreateYoutubeVideoDto {
    id++;
    return {
        videoId: `Test id ${id}`,
        title: `Test title ${id}`,
        politicians: [id]

    } as CreateYoutubeVideoDto
}

function equals(youtubeVideo: YoutubeVideo, createYoutubeVideoDto: CreateYoutubeVideoDto) {
    expect(youtubeVideo.title).toEqual(createYoutubeVideoDto.title);
    expect(youtubeVideo.videoId).toEqual(createYoutubeVideoDto.videoId);
}

describe('YoutubeVideoController (e2e)', () => {
    it('/youtube (GET)', async () => {
        const createDto = createYoutubeVideo();
        await service.create(createDto);

        const response = await request(app.getHttpServer())
            .get('/youtube');

        expect(response.status).toEqual(200);
    });

    it('/youtube?limit=1 (GET)', async() => {
        const createDto1 = createYoutubeVideo();
        const createDto2 = createYoutubeVideo();

        await service.create(createDto1);
        await service.create(createDto2);

        const response = await request(app.getHttpServer())
            .get(`/youtube?limit=1`);

        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(1);
        equals(response.body[0], createDto2);
    });

    it('/youtube (POST)', async() => {
        const createDto = createYoutubeVideo();
        const res = await request(app.getHttpServer())
            .post('/youtube')
            .send(createDto);

        const resultingYoutubeVideo = res.body as YoutubeVideo;
        equals(resultingYoutubeVideo, createDto);
    });

    it('/youtube?limit=1 (GET)', async() => {
        const createDto1 = createYoutubeVideo();
        const createDto2 = createYoutubeVideo();

        await service.create(createDto1);
        await service.create(createDto2);

        const response = await request(app.getHttpServer())
            .get('/youtube?limit=1');

        expect(response.status).toEqual(200);
        equals(response.body[0], createDto2);
    });

    it('/youtube?limit=1&offset=1 (GET)', async() => {
        const createDto1 = createYoutubeVideo();
        const createDto2 = createYoutubeVideo();

        await service.create(createDto1);
        await service.create(createDto2);

        const response = await request(app.getHttpServer())
            .get('/youtube?limit=1&offset=1');

        expect(response.status).toEqual(200);
        equals(response.body[0], createDto1);
    });

    it('/youtube?politician={id} (GET)', async() => {
        const targetVideo = createYoutubeVideo();
        const otherVideo = createYoutubeVideo();

        await Promise.all([
            service.create(targetVideo),
            service.create(otherVideo)
        ]);

        const response = await request(app.getHttpServer())
            .get(`/youtube?politician=${targetVideo.politicians[0]}`);

        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(1);
        equals(response.body[0], targetVideo);
    });

    it('handle youtube video created', async () => {
        const createYoutubeVideoDto = createYoutubeVideo();
        const json = await client.emit('video-youtube-video-created', createYoutubeVideoDto).toPromise();
        expect(json[0].topicName).toEqual('video-youtube-video-created');

        await waitForExpect(async () => {
            const youtubeVideos: YoutubeVideo[] = await service.find({});
            expect(youtubeVideos.length).toEqual(1);
            equals(youtubeVideos[0], createYoutubeVideoDto);
        });
    });
});

