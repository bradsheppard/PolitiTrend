import Politician from './Politician';
import axios, { AxiosInstance } from 'axios';
import { NextPageContext } from 'next';
import absoluteUrl from '../utils/absoluteUrl';

class PoliticianApi {

    private static baseUrl = '/api/politicians';

    static async get(context: NextPageContext): Promise<Array<Politician>> {
        const axiosInstance = this.createAxiosInstance(context);
        const res = await axiosInstance.get('');
        return res.data;
    }

    static async getOne(context: NextPageContext, id: number): Promise<Politician | null> {
        const axiosInstance = this.createAxiosInstance(context);
        const res = await axiosInstance.get(`/${id}`);

        if(res.status === 200)
            return res.data;

        return null;
    }

    private static createAxiosInstance(context: NextPageContext): AxiosInstance {
        const { origin } = absoluteUrl(context.req);
        const prefix = `${origin}${this.baseUrl}`;

        return axios.create({baseURL: prefix});
    }
}

export default PoliticianApi;