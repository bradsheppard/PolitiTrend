import * as mongoose from 'mongoose'

const SentimentSchema = new mongoose.Schema({
	politician: Number,
	sentiment: Number,
	sampleSize: Number,
	dateTime: {
		type: Date,
		default: Date.now
	},
});

SentimentSchema.index({politician: 1, dateTime: -1});

SentimentSchema.set('toJSON', {
	transform: (doc, ret) => {
		ret.id = ret._id;
		delete ret._id;
		delete  ret.__v;
	}
});

export { SentimentSchema }
