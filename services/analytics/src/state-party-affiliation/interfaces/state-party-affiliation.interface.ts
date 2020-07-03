import { Document } from 'mongoose';

export interface StatePartyAffiliation extends Document {
	state: string
	dateTime: Date;
	affiliations: {
		democratic: number;
		republican: number;
	}
}
