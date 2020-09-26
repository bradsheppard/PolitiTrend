import * as mongoose from 'mongoose'

const YoutubeVideoSchema = new mongoose.Schema({
    videoId: { type: String, index: true, unique: true },
    title: String,
    thumbnail: String,
    politicians: [Number],
    dateTime: { type: Date, index: true },
});

YoutubeVideoSchema.index({politician: 1, dateTime: -1});

YoutubeVideoSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete  ret.__v;
    }
});

export { YoutubeVideoSchema }
