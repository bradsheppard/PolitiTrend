import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

let app: INestApplication;

beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
            AppModule,
        ],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
});

afterAll(async () => {
    await app.close();
});

describe('HealthController (e2e)', () => {
    it('/health (GET)', async () => {
        const response = await request(app.getHttpServer())
            .get('/health');

        expect(response.status).toEqual(200);
    });
});
