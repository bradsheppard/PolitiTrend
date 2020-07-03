import { Module } from '@nestjs/common';
import { StatePartyAffiliationController } from './state-party-affiliation.controller';
import { StatePartyAffiliationService } from './state-party-affiliation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StatePartyAffiliationSchema } from './schemas/state-party-affiliation.schema';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'StatePartyAffiliation', schema: StatePartyAffiliationSchema }])],
	controllers: [StatePartyAffiliationController],
	providers: [StatePartyAffiliationService],
})
export class StatePartyAffiliationModule {}
