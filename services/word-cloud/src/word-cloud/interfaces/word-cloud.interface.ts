import { Document } from 'mongoose';

export interface WordCloud extends Document {
	readonly politician: number;
	readonly words: Array<Word>;
	readonly dateTime: Date;
}

export interface Word {
	word: string;
	count: number;
}
