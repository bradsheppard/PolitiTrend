import * as mongoose from 'mongoose'

const YoutubeVideoSchema = new mongoose.Schema({
    videoId: String,
    title: String,
    thumbnail: String,
    politicians: [Number]
});

YoutubeVideoSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete  ret.__v;
    }
});

export { YoutubeVideoSchema }
