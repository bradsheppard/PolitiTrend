import * as mongoose from 'mongoose';

const PoliticianSentimentSchema = new mongoose.Schema({
    politician: Number,
    sentiment: Number,
    sampleSize: Number,
    dateTime: {
        type: Date,
        default: Date.now,
    },
});

PoliticianSentimentSchema.index({ dateTime: -1 });

PoliticianSentimentSchema.index({ politician: 1, dateTime: -1 });

PoliticianSentimentSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});

export { PoliticianSentimentSchema };
