import { Document } from 'mongoose';

export interface PartySentiment extends Document {
	party: string;
	sentiment: number;
	sampleSize: number;
	dateTime: Date;
}
