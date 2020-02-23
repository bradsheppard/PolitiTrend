import { url } from '../Utils';
import axios, { AxiosInstance } from 'axios';
import NewsArticleDto from './NewsArticleDto';
import SearchNewsArticleDto from './SearchNewsArticleDto';

class NewsArticleApi {

    private static url = `http://${url}/api/newsarticles`;

    static async get(searchNewsArticleDto?: SearchNewsArticleDto): Promise<NewsArticleDto[]> {
        const axiosInstance = this.createAxiosInstance();
        const res = await axiosInstance.get<NewsArticleDto[]>('', {params: searchNewsArticleDto});
        return res.data;
    }

    private static createAxiosInstance(): AxiosInstance {
        return axios.create({baseURL: this.url});
    }
}

export default NewsArticleApi;
