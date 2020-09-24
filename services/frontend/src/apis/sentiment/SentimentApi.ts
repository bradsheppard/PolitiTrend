import { url } from '../Utils';
import axios, { AxiosInstance } from 'axios';
import SentimentDto from './SentimentDto';

class SentimentApi {

    private static url = `http://${url}/api/sentiment`;
    private static LOOKBACK_DAYS = 30;

    static async get(): Promise<SentimentDto[]> {
        const axiosInstance = this.createAxiosInstance();
        const res = await axiosInstance.get<SentimentDto[]>('');
        return res.data;
    }

    static async getHistoryForPolitician(id: number): Promise<SentimentDto[]> {
        const axiosInstance = this.createAxiosInstance();
        const start = new Date();
        start.setDate(start.getDate() - SentimentApi.LOOKBACK_DAYS)

        const res = await axiosInstance.get<SentimentDto[]>('',
            {
                params: {
                    politician: id,
                    start
                }
            });
        return res.data;
    }

    private static createAxiosInstance(): AxiosInstance {
        return axios.create({baseURL: this.url});
    }
}

export default SentimentApi;
