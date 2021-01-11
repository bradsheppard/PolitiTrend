import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ClientProxy, ClientsModule } from '@nestjs/microservices';
import microserviceConfig from '../src/config/config.microservice';
import { ClientProviderOptions } from '@nestjs/microservices/module/interfaces/clients-module.interface';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PoliticianSentimentService } from '../src/politician-sentiment/politician-sentiment.service';
import * as request from 'supertest';
import { CreatePoliticianSentimentDto } from '../src/politician-sentiment/dtos/create-politician-sentiment.dto';
import { PoliticianSentiment } from '../src/politician-sentiment/interfaces/politician-sentiment.interface';
import waitForExpect from 'wait-for-expect';

let app: INestApplication;
let service: PoliticianSentimentService;
let client: ClientProxy;

jest.setTimeout(120000);

beforeAll(async () => {
    const name = {
        name: 'POLITICIAN_SENTIMENT_SERVICE',
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
    app.useGlobalPipes(new ValidationPipe({ transform: true, skipMissingProperties: true }));
    app.connectMicroservice(microserviceConfig);

    service = moduleFixture.get<PoliticianSentimentService>(PoliticianSentimentService);
    client = app.get('POLITICIAN_SENTIMENT_SERVICE');

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

let id = 0;

function createSentiment(): CreatePoliticianSentimentDto {
    id++;
    return {
        sentiment: id,
        politician: id,
        sampleSize: id + 100,
    };
}

function createSentimentWithSampleSizeForPolitician(
    politician: number,
    sampleSize: number,
): CreatePoliticianSentimentDto {
    id++;
    return {
        sentiment: id,
        politician,
        sampleSize,
    };
}

function equals(sentiment: PoliticianSentiment, sentimentDto: CreatePoliticianSentimentDto) {
    expect(sentiment.sentiment).toEqual(sentimentDto.sentiment);
    expect(sentiment.politician).toEqual(sentimentDto.politician);
    expect(sentiment.sampleSize).toEqual(sentimentDto.sampleSize);
}

function equalsWithDate(sentiment: PoliticianSentiment, sentimentDto: CreatePoliticianSentimentDto) {
    expect(sentiment.sentiment).toEqual(sentimentDto.sentiment);
    expect(sentiment.politician).toEqual(sentimentDto.politician);
    expect(sentiment.sampleSize).toEqual(sentimentDto.sampleSize);
    expect(sentiment.dateTime).toEqual(sentimentDto.dateTime.toISOString());
}

describe('Politician Sentiment (e2e)', () => {
    it('/politician-sentiment (GET)', async () => {
        const currentDate = new Date('2020-01-02');
        const yesterday = new Date('2020-01-01');

        const politician1CreatePoliticianSentimentDto1: CreatePoliticianSentimentDto = {
            sentiment: 1,
            sampleSize: 100,
            politician: 1,
            dateTime: currentDate,
        };
        const politician1CreatePoliticianSentimentDto2: CreatePoliticianSentimentDto = {
            sentiment: 2,
            sampleSize: 200,
            politician: 1,
            dateTime: yesterday,
        };

        const politician2CreatePoliticianSentimentDto1: CreatePoliticianSentimentDto = {
            sentiment: 1,
            sampleSize: 100,
            politician: 2,
            dateTime: currentDate,
        };
        const politician2CreatePoliticianSentimentDto2: CreatePoliticianSentimentDto = {
            sentiment: 2,
            sampleSize: 200,
            politician: 2,
            dateTime: yesterday,
        };

        await Promise.all([
            service.create(politician1CreatePoliticianSentimentDto1),
            service.create(politician1CreatePoliticianSentimentDto2),
            service.create(politician2CreatePoliticianSentimentDto1),
            service.create(politician2CreatePoliticianSentimentDto2),
        ]);

        const expectedResponse = [
            politician1CreatePoliticianSentimentDto1,
            politician1CreatePoliticianSentimentDto2,
            politician2CreatePoliticianSentimentDto1,
            politician2CreatePoliticianSentimentDto2,
        ];

        const response = await request(app.getHttpServer()).get('/politician-sentiment');

        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(4);
        for (let i = 0; i < response.body.length; i++) {
            equalsWithDate(response.body[i], expectedResponse[i]);
        }
    });

    it('/politician-sentiment?politician={id} (GET) One day', async () => {
        const currentDate = new Date('2020-01-02');
        const yesterday = new Date('2020-01-01');

        const politician1CreatePoliticianSentimentDto1: CreatePoliticianSentimentDto = {
            politician: 1,
            sampleSize: 100,
            sentiment: 1,
            dateTime: currentDate,
        };
        const politician1CreatePoliticianSentimentDto2: CreatePoliticianSentimentDto = {
            politician: 1,
            sampleSize: 200,
            sentiment: 4,
            dateTime: yesterday,
        };

        const politician2CreatePoliticianSentimentDto1: CreatePoliticianSentimentDto = {
            politician: 2,
            sampleSize: 300,
            sentiment: 5,
            dateTime: currentDate,
        };
        const politician2CreatePoliticianSentimentDto2: CreatePoliticianSentimentDto = {
            politician: 2,
            sampleSize: 400,
            sentiment: 6,
            dateTime: yesterday,
        };

        const expectedResponse = [politician1CreatePoliticianSentimentDto1, politician1CreatePoliticianSentimentDto2];

        await Promise.all([
            service.create(politician1CreatePoliticianSentimentDto1),
            service.create(politician1CreatePoliticianSentimentDto2),
            service.create(politician2CreatePoliticianSentimentDto1),
            service.create(politician2CreatePoliticianSentimentDto2),
        ]);

        const response = await request(app.getHttpServer()).get('/politician-sentiment?politician=1');

        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(2);
        for (let i = 0; i < response.body.length; i++) {
            equals(response.body[i], expectedResponse[i]);
        }
    });

    it('/politician-sentiment?politician={id}&resample=86400000 (GET) One day with resampling', async () => {
        const politician1CreatePoliticianSentimentDto1: CreatePoliticianSentimentDto = {
            politician: 1,
            sampleSize: 100,
            sentiment: 1,
        };
        const politician1CreatePoliticianSentimentDto2: CreatePoliticianSentimentDto = {
            politician: 1,
            sampleSize: 200,
            sentiment: 4,
        };

        const politician2CreatePoliticianSentimentDto1: CreatePoliticianSentimentDto = {
            politician: 2,
            sampleSize: 300,
            sentiment: 5,
        };
        const politician2CreatePoliticianSentimentDto2: CreatePoliticianSentimentDto = {
            politician: 2,
            sampleSize: 400,
            sentiment: 6,
        };

        const expectedResponse = [
            {
                politician: 1,
                sampleSize: 150,
                sentiment: 3,
            },
        ];

        await Promise.all([
            service.create(politician1CreatePoliticianSentimentDto1),
            service.create(politician1CreatePoliticianSentimentDto2),
            service.create(politician2CreatePoliticianSentimentDto1),
            service.create(politician2CreatePoliticianSentimentDto2),
        ]);

        const response = await request(app.getHttpServer()).get(
            '/politician-sentiment?politician=1&resample=86400000',
        );

        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(1);
        for (let i = 0; i < response.body.length; i++) {
            equals(response.body[i], expectedResponse[i]);
        }
    });

    it('/politician-sentiment?politician={id}&start=2020-01-01&resample=86400000 (GET) Multiple day downsampling', async () => {
        const currentDate = new Date('2020-01-02');
        const yesterday = new Date('2020-01-01');

        const politician1CreatePoliticianSentimentDto1: CreatePoliticianSentimentDto = {
            politician: 1,
            sampleSize: 100,
            sentiment: 1,
            dateTime: currentDate,
        };
        const politician1CreatePoliticianSentimentDto2: CreatePoliticianSentimentDto = {
            politician: 1,
            sampleSize: 200,
            sentiment: 4,
            dateTime: currentDate,
        };

        const politician1CreatePoliticianSentimentDto3: CreatePoliticianSentimentDto = {
            politician: 1,
            sampleSize: 500,
            sentiment: 1,
            dateTime: yesterday,
        };
        const politician1CreatePoliticianSentimentDto4: CreatePoliticianSentimentDto = {
            politician: 1,
            sampleSize: 1500,
            sentiment: 4,
            dateTime: yesterday,
        };

        const politician2CreatePoliticianSentimentDto1: CreatePoliticianSentimentDto = {
            politician: 2,
            sampleSize: 300,
            sentiment: 5,
        };
        const politician2CreatePoliticianSentimentDto2: CreatePoliticianSentimentDto = {
            politician: 2,
            sampleSize: 400,
            sentiment: 6,
        };

        const expectedResponse = [
            {
                politician: 1,
                sampleSize: 150,
                sentiment: 3,
                dateTime: currentDate,
            },
            {
                politician: 1,
                sampleSize: 1000,
                sentiment: 3.25,
                dateTime: yesterday,
            },
        ];

        await Promise.all([
            service.create(politician1CreatePoliticianSentimentDto1),
            service.create(politician1CreatePoliticianSentimentDto2),
            service.create(politician1CreatePoliticianSentimentDto3),
            service.create(politician1CreatePoliticianSentimentDto4),
            service.create(politician2CreatePoliticianSentimentDto1),
            service.create(politician2CreatePoliticianSentimentDto2),
        ]);

        const response = await request(app.getHttpServer()).get(
            '/politician-sentiment?politician=1&start=2020-01-01&resample=86400000',
        );

        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(expectedResponse.length);

        for (let i = 0; i < response.body.length; i++) {
            equalsWithDate(response.body[i], expectedResponse[i]);
        }
    });

    it('/politician-sentiment?minSampleSize=3 (GET)', async () => {
        const politician1CreatePoliticianSentimentDto = createSentimentWithSampleSizeForPolitician(1, 4);
        const politician2CreatePoliticianSentimentDto = createSentimentWithSampleSizeForPolitician(2, 1);

        await Promise.all([
            service.create(politician1CreatePoliticianSentimentDto),
            service.create(politician2CreatePoliticianSentimentDto),
        ]);

        const response = await request(app.getHttpServer()).get('/politician-sentiment?minSampleSize=3');

        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(1);
        equals(response.body[0], politician1CreatePoliticianSentimentDto);
    });

    it('/politician-sentiment (POST)', async () => {
        const createDto = createSentiment();
        const res = await request(app.getHttpServer())
            .post('/politician-sentiment')
            .send(createDto);

        const resultingSentiment = res.body as PoliticianSentiment;
        equals(resultingSentiment, createDto);
    });

    it('handle politician sentiment created', async () => {
        const createDto = createSentiment();
        const json = await client.emit('analytics-politician-sentiment-created', createDto).toPromise();

        expect(json[0].topicName).toEqual('analytics-politician-sentiment-created');

        await waitForExpect(async () => {
            const sentiments: PoliticianSentiment[] = await service.find({});
            expect(sentiments.length).toEqual(1);
            equals(sentiments[0], createDto);
        });
    });
});
