import * as mongoose from 'mongoose'

const WordCloudSchema = new mongoose.Schema({
	politician: Number,
	dateTime: {
		type: Date,
		default: Date.now
	},
	words: [{
		_id: false,
		word: String,
		count: Number
	}]
});

WordCloudSchema.set('toJSON', {
	transform: (doc, ret) => {
		ret.id = ret._id;
		delete ret._id;
		delete  ret.__v;
	}
});

export { WordCloudSchema };
