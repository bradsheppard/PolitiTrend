import * as mongoose from 'mongoose';

const StatePartyAffiliationSchema = new mongoose.Schema({
    state: String,
    dateTime: {
        type: Date,
        default: Date.now,
    },
    affiliations: {
        democratic: Number,
        republican: Number,
    },
    sampleSize: Number,
});

StatePartyAffiliationSchema.index({ state: 1, dateTime: -1 });

StatePartyAffiliationSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});

export { StatePartyAffiliationSchema };
