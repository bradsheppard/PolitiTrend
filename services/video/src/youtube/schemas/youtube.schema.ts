import * as mongoose from 'mongoose'

const YoutubeSchema = new mongoose.Schema({
    url: String
});

YoutubeSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete  ret.__v;
    }
});

export { YoutubeSchema }
