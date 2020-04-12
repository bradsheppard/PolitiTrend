import { Document } from 'mongoose';

export interface YoutubeVideo extends Document {
    videoId: string;
    title: string;
    politicians: number[];
}
