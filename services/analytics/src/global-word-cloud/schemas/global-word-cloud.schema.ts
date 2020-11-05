import * as mongoose from 'mongoose';

const GlobalWordCloudSchema = new mongoose.Schema({
    dateTime: {
        type: Date,
        default: Date.now,
        index: true,
    },
    words: [
        {
            _id: false,
            word: String,
            count: Number,
        },
    ],
});

GlobalWordCloudSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});

export { GlobalWordCloudSchema };
