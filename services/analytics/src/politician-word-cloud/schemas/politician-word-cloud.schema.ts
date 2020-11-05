import * as mongoose from 'mongoose';

const PoliticianWordCloudSchema = new mongoose.Schema({
    politician: Number,
    dateTime: {
        type: Date,
        default: Date.now,
    },
    words: [
        {
            _id: false,
            word: String,
            count: Number,
        },
    ],
});

PoliticianWordCloudSchema.index({ politician: 1, dateTime: -1 });

PoliticianWordCloudSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});

export { PoliticianWordCloudSchema };
