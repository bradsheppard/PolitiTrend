import { Module } from '@nestjs/common';
import { WordCloudModule } from './word-cloud/word-cloud.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
	imports: [
		MongooseModule.forRoot('mongodb://root:pass123@word-cloud-mongodb'),
		WordCloudModule,
	],
})
export class AppModule {}
