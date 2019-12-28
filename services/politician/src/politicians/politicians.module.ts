import { Module } from '@nestjs/common';
import { PoliticiansController } from './politicians.controller';
import { PoliticiansService } from './politicians.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Politician from './politicians.entity';
import PoliticianSeeder from './seeder/politician.seeder';

@Module({
	controllers: [PoliticiansController],
	providers: [PoliticiansService, PoliticianSeeder],
	imports: [TypeOrmModule.forFeature([Politician])],
})
export class PoliticiansModule {}
