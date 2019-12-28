import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('PoliticianController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/ (GET)', async () => {
		const response = await request(app.getHttpServer()).get('/');

		expect(response.status).toBe(200);
		expect(response.body.length).toBe(100);
	});

	afterAll(() => {
		app.close();
	});
});
