import * as mongoose from 'mongoose';

const PartySentimentSchema = new mongoose.Schema({
	party: String,
	sentiment: Number,
	sampleSize: Number,
	dateTime: {
		type: Date,
		default: Date.now,
	},
});

PartySentimentSchema.index({ dateTime: -1 });

PartySentimentSchema.index({ party: 1, dateTime: -1 });

PartySentimentSchema.set('toJSON', {
	transform: (doc, ret) => {
		ret.id = ret._id;
		delete ret._id;
		delete ret.__v;
	},
});

export { PartySentimentSchema };
