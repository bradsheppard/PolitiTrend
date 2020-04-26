import { url } from '../../Utils';
import SearchYoutubeVideoDto from './SearchYoutubeVideoDto';
import axios, { AxiosInstance } from 'axios';
import YoutubeVideoDto from './YoutubeVideoDto';

class YoutubeVideoApi {

    private static url = `http://${url}/api/videos/youtube`;

    static async get(searchYoutubeVideoDto: SearchYoutubeVideoDto) {
        const axiosInstance = this.createAxiosInstance();
        const res = await axiosInstance.get<YoutubeVideoDto[]>('', {params: searchYoutubeVideoDto});
        return res.data;
    }

    private static createAxiosInstance(): AxiosInstance {
        return axios.create({baseURL: this.url});
    }
}

export default YoutubeVideoApi;
