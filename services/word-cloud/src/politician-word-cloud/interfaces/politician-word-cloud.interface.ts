import { Document } from 'mongoose';

export interface PoliticianWordCloud extends Document {
	politician: number;
	words: Array<Word>;
	dateTime: Date;
}

export interface Word {
	word: string;
	count: number;
}
