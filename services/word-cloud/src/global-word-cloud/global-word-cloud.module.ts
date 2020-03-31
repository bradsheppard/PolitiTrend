import { Module } from '@nestjs/common';
import { GlobalWordCloudController } from './global-word-cloud.controller';
import { GlobalWordCloudService } from './global-word-cloud.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GlobalWordCloudSchema }  from './schemas/global-word-cloud.schema';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'GlobalWordCloud', schema: GlobalWordCloudSchema }])],
	controllers: [GlobalWordCloudController],
	providers: [GlobalWordCloudService],
})
export class GlobalWordCloudModule {
}
