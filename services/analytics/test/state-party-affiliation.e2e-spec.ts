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
      republican: 1 - id
    },
    sampleSize: id
  }
}

function createStatePartyAffiliationDtoForState(state: string): CreateStatePartyAffiliationDto {
  id++;
  return {
    state,
    affiliations: {
      democratic: id,
      republican: 1 - id
    },
    sampleSize: id
  }
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
  app.useGlobalPipes(new ValidationPipe({transform: true, skipMissingProperties: true}));
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

function equals(statePartyAffiliation: StatePartyAffiliation, statePartyAffiliationDto: CreateStatePartyAffiliationDto) {
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

    const response = await request(app.getHttpServer())
      .get(`/state-party-affiliation`);

    expect(response.status).toEqual(200);
    expect(response.body.length).toEqual(2);
    equals(response.body[0], createDto1);
    equals(response.body[1], createDto2);
  });

  it('/state-party-affiliation (GET, same state)', async () => {
    const createDto1 = createStatePartyAffiliationDtoForState('TestState');
    const createDto2 = createStatePartyAffiliationDtoForState('TestState');

    await service.create(createDto1);
    await service.create(createDto2);

    const response = await request(app.getHttpServer())
      .get(`/state-party-affiliation`);

    expect(response.status).toEqual(200);
    expect(response.body.length).toEqual(1);
    equals(response.body[0], createDto2);
  });

  it('Handle state party affiliation created', async () => {
    const createDto = createStatePartyAffiliationDto();
    const json = await client.emit('analytics-state-party-affiliation-created', createDto).toPromise();

    expect(json[0].topicName).toEqual('analytics-state-party-affiliation-created');

    await waitForExpect(async () => {
      const statePartyAffiliations: StatePartyAffiliation[] = await service.findAll();
      expect(statePartyAffiliations.length).toEqual(1);
      equals(statePartyAffiliations[0], createDto);
    });
  });
});
