import { Module } from '@nestjs/common';
import { YoutubeVideoModule } from './youtube-video/youtube-video.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthController } from './health/health.controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
    imports: [
        YoutubeVideoModule,
        TerminusModule,
        MongooseModule.forRootAsync({
            imports: [ConfigModule.forRoot()],
            useFactory: async (configService: ConfigService) => {
                return {
                    useFindAndModify: false,
                    uri: configService.get<string>('MONGODB_URI'),
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useCreateIndex: true
                }
            },
            inject: [ConfigService]
        }),
    ],
    controllers: [HealthController],
})
export class AppModule {
}
