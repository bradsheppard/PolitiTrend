import axios, { AxiosInstance } from 'axios';
import { NextPageContext } from 'next';
import absoluteUrl from '../utils/absoluteUrl';
import Opinion from './Opinion';

class OpinionApi {

    private static baseUrl = '/api/opinions';

    static async get(context: NextPageContext): Promise<Array<Opinion>> {
        const axiosInstance = this.createAxiosInstance(context);
        const res = await axiosInstance.get<Array<Opinion>>('');
        return res.data;
    }

    private static createAxiosInstance(context: NextPageContext): AxiosInstance {
        const { origin } = absoluteUrl(context.req);
        const prefix = `${origin}${this.baseUrl}`;
        return axios.create({baseURL: prefix});
    }
}

export default OpinionApi;