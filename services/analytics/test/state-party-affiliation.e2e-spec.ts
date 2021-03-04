import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ClientProxy, ClientsModule } from '@nestjs/microservices';
import microserviceConfig from '../src/config/config.microservice';
import { ClientProviderOptions } from '@nestjs/microservices/module/interfaces/clients-module.interface';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { StatePartyAffiliationService } from '../src/state-party-affiliation/state-party-affiliation.service';
import { CreateStatePartyAffiliationDto } from '../src/state-party-affiliation/dtos/create-state-party-affiliation-dto';
import * as request from 'supertest';
import { StatePartyAffiliation } from '../src/state-party-affiliation/interfaces/state-party-affiliation.interface';
import waitForExpect from 'wait-for-expect';

let app: INestApplication;
let service: StatePartyAffiliationService;
let client: ClientProxy;

jest.setTimeout(120000);

let id = 0;

function createStatePartyAffiliationDto(): CreateStatePartyAffiliationDto {
    id++;
    return {
        state: `State ${id}`,
        affiliations: {
            democratic: id,
            republican: 1 - id,
        },
        sampleSize: id,
    };
}

function createStatePartyAffiliationDtoFroStateAndDate(
    state: string,
    dateTime: Date,
): CreateStatePartyAffiliationDto {
    id++;
    return {
        state,
        affiliations: {
            democratic: id,
            republican: 1 - id,
        },
        sampleSize: id,
        dateTime,
    };
}

beforeAll(async () => {
    const name = {
        name: 'STATE_PARTY_AFFILIATION_SERVICE',
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

    service = moduleFixture.get<StatePartyAffiliationService>(StatePartyAffiliationService);
    client = app.get('STATE_PARTY_AFFILIATION_SERVICE');

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

function equals(
    statePartyAffiliation: StatePartyAffiliation,
    statePartyAffiliationDto: CreateStatePartyAffiliationDto,
) {
    expect(statePartyAffiliation.state).toEqual(statePartyAffiliationDto.state);
    expect(statePartyAffiliation.affiliations).toEqual(statePartyAffiliationDto.affiliations);
    expect(statePartyAffiliation.sampleSize).toEqual(statePartyAffiliation.sampleSize);
}

describe('State Party Affiliation (e2e)', () => {
    it('/state-party-affiliation (GET, different states)', async () => {
        const createDto1 = createStatePartyAffiliationDto();
        const createDto2 = createStatePartyAffiliationDto();

        await service.create(createDto1);
        await service.create(createDto2);

        const response = await request(app.getHttpServer()).get(`/state-party-affiliation`);

        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(2);
        equals(response.body[0], createDto2);
        equals(response.body[1], createDto1);
    });

    it('/state-party-affiliation (GET, same state)', async () => {
        const currentDate = new Date('2020-01-02');
        const yesterday = new Date('2020-01-01');

        const createDto1 = createStatePartyAffiliationDtoFroStateAndDate('TestState', currentDate);
        const createDto2 = createStatePartyAffiliationDtoFroStateAndDate('TestState', yesterday);

        await Promise.all([service.create(createDto1), service.create(createDto2)]);

        const response = await request(app.getHttpServer()).get(`/state-party-affiliation`);

        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(2);

        equals(response.body[0], createDto1);
        equals(response.body[1], createDto2);
    });

    it('/state-party-affiliation?resample=86400000 (GET) One day with resampling', async () => {
        const statePartyAffiliationDto1: CreateStatePartyAffiliationDto = {
            sampleSize: 100,
            affiliations: {
                democratic: 0,
                republican: 1,
            },
            state: 'Texas',
        };
        const statePartyAffiliationDto2: CreateStatePartyAffiliationDto = {
            sampleSize: 200,
            affiliations: {
                democratic: 6,
                republican: 4,
            },
            state: 'Texas',
        };

        const statePartyAffiliationDto3: CreateStatePartyAffiliationDto = {
            sampleSize: 300,
            affiliations: {
                democratic: 2,
                republican: 1,
            },
            state: 'Virginia',
        };
        const statePartyAffiliationDto4: CreateStatePartyAffiliationDto = {
            sampleSize: 600,
            affiliations: {
                democratic: 5,
                republican: 4,
            },
            state: 'Virginia',
        };

        await Promise.all([
            service.create(statePartyAffiliationDto1),
            service.create(statePartyAffiliationDto2),
            service.create(statePartyAffiliationDto3),
            service.create(statePartyAffiliationDto4),
        ]);

        const expectedResponse = [
            {
                state: 'Texas',
                sampleSize: 150,
                affiliations: {
                    democratic: 4,
                    republican: 3,
                },
            },
            {
                state: 'Virginia',
                sampleSize: 450,
                affiliations: {
                    democratic: 4,
                    republican: 3,
                },
            },
        ];

        const response = await request(app.getHttpServer()).get(
            '/state-party-affiliation?resample=86400000',
        );

        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(2);
        for (let i = 0; i < response.body.length; i++) {
            equals(response.body[i], expectedResponse[i]);
        }
    });

    it('/state-party-affiliation?resample=172800000 (GET) Multiple days with two day resampling', async () => {
        const millisecondsInDay = 24 * 60 * 60 * 1000;
        const halfDayAgo = new Date(Date.now() - 0.5 * millisecondsInDay);
        const fourDaysAgo = new Date(Date.now() - 4 * millisecondsInDay);

        const statePartyAffiliationDto1: CreateStatePartyAffiliationDto = {
            sampleSize: 100,
            affiliations: {
                democratic: 0,
                republican: 1,
            },
            dateTime: halfDayAgo,
            state: 'Texas',
        };
        const statePartyAffiliationDto2: CreateStatePartyAffiliationDto = {
            sampleSize: 200,
            affiliations: {
                democratic: 6,
                republican: 4,
            },
            state: 'Texas',
        };
        const statePartyAffiliationDto3: CreateStatePartyAffiliationDto = {
            sampleSize: 200,
            affiliations: {
                democratic: 6,
                republican: 4,
            },
            state: 'Texas',
            dateTime: fourDaysAgo
        }

        await Promise.all([
            service.create(statePartyAffiliationDto1),
            service.create(statePartyAffiliationDto2),
            service.create(statePartyAffiliationDto3),
        ]);

        const expectedResponse = [
            {
                state: 'Texas',
                sampleSize: 150,
                affiliations: {
                    democratic: 4,
                    republican: 3,
                },
            },
            {
                state: 'Texas',
                sampleSize: 200,
                affiliations: {
                    democratic: 6,
                    republican: 4,
                },
            },
        ];

        const response = await request(app.getHttpServer()).get(
            '/state-party-affiliation?resample=172800000',
        );

        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(2);
        for (let i = 0; i < response.body.length; i++) {
            equals(response.body[i], expectedResponse[i]);
        }
    });

    it('/state-party-affiliation?minSampleSize=3', async () => {
        const statePartyAffiliationDto1: CreateStatePartyAffiliationDto = {
            sampleSize: 1,
            affiliations: {
                democratic: 0,
                republican: 1,
            },
            state: 'Texas',
        };
        const statePartyAffiliationDto2: CreateStatePartyAffiliationDto = {
            sampleSize: 4,
            affiliations: {
                democratic: 6,
                republican: 4,
            },
            state: 'Texas',
        };

        await Promise.all([
            service.create(statePartyAffiliationDto1),
            service.create(statePartyAffiliationDto2),
        ]);

        const response = await request(app.getHttpServer()).get(
            '/state-party-affiliation?minSampleSize=3',
        );

        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(1);

        equals(response.body[0], statePartyAffiliationDto2);
    });

    it('Handle state party affiliation created', async () => {
        const createDto = createStatePartyAffiliationDto();
        const json = await client
            .emit('analytics-state-party-affiliation-created', createDto)
            .toPromise();

        expect(json[0].topicName).toEqual('analytics-state-party-affiliation-created');

        await waitForExpect(async () => {
            const statePartyAffiliations: StatePartyAffiliation[] = await service.find({});
            expect(statePartyAffiliations.length).toEqual(1);
            equals(statePartyAffiliations[0], createDto);
        });
    });
});
