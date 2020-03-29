import { url } from '../Utils';
import WordCloudDto from './WordCloudDto';
import SearchWordCloudDto from './SearchWordCloudDto';
import axios, { AxiosInstance } from 'axios';

class WordCloudApi {

    private static url = `http://${url}/api/wordclouds`;

    static async get(searchWordCloudDto?: SearchWordCloudDto): Promise<WordCloudDto[]> {
        const axiosInstance = this.createAxiosInstance();
        const res = await axiosInstance.get<WordCloudDto[]>('', {params: searchWordCloudDto});
        return res.data;
    }

    private static createAxiosInstance(): AxiosInstance {
        return axios.create({baseURL: this.url});
    }
}

export default WordCloudApi;
