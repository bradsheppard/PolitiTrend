import { Document } from 'mongoose';

export interface Sentiment extends Document {
	politician: number;
	sentiment: number;
	sampleSize: number;
	dateTime: Date;
}
