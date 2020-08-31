import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Tweet extends Document {
	@Prop({index: true, unique: true})
	tweetId: string;

	@Prop()
	tweetText: string;

	@Prop()
	location: string;

	@Prop({index: true})
	dateTime: Date;

	@Prop([Number])
	politicians: number[]
}

const TweetSchema = SchemaFactory.createForClass(Tweet);
TweetSchema.index({politician: 1, dateTime: -1})

TweetSchema.set('toJSON', {
	transform: (doc, ret) => {
		ret.id = ret._id;
		delete ret._id;
		delete  ret.__v;
	}
});

export { TweetSchema }
