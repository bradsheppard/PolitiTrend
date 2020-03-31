import { Document } from 'mongoose';

export interface GlobalWordCloud extends Document {
	words: Array<Word>;
	dateTime: Date;
}

export interface Word {
	word: string;
	count: number;
}
