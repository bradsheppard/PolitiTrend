import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import PoliticianSeeder from './politician.seeder';

async function run() {
	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	}).compile();

	const seeder = moduleFixture.get<PoliticianSeeder>(PoliticianSeeder);
	const newPoliticians = await PoliticianSeeder.getPoliticiansFromDataFiles();
	await seeder.updatePoliticianList(newPoliticians);
}

run();
