import { url } from '../Utils';
import axios, { AxiosInstance } from 'axios';
import SentimentDto from './SentimentDto';

class SentimentApi {

    private static url = `http://${url}/api/sentiment`;

    static async get(): Promise<SentimentDto[]> {
        const axiosInstance = this.createAxiosInstance();
        const res = await axiosInstance.get<SentimentDto[]>('');
        return res.data;
    }

    static async getForPolitician(id: number): Promise<SentimentDto[]> {
        const axiosInstance = this.createAxiosInstance();
        const res = await axiosInstance.get<SentimentDto[]>('', {params: {politician: id}});
        return res.data;
    }

    private static createAxiosInstance(): AxiosInstance {
        return axios.create({baseURL: this.url});
    }
}

export default SentimentApi;
