import { Document } from 'mongoose';

export interface PoliticianSentiment extends Document {
    politician: number;
    sentiment: number;
    sampleSize: number;
    dateTime: Date;
}
