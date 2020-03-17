import { Module } from '@nestjs/common';
import { PoliticiansModule } from './politicians/politicians.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forRoot(), PoliticiansModule],
})
export class AppModule {}
