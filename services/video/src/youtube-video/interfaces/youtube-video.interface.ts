import { Document } from 'mongoose';

export interface YoutubeVideo extends Document {
    videoId: string;
    title: string;
    thumbnail: string;
    politicians: number[];
}
