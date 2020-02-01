import axios, { AxiosInstance } from 'axios';
import { NextPageContext } from 'next';
import absoluteUrl from '../../utils/absoluteUrl';
import PoliticianDto from './PoliticianDto';

class PoliticianApi {

    private static baseUrl = '/api/politicians';

    static async get(context: NextPageContext): Promise<PoliticianDto[]> {
        const axiosInstance = this.createAxiosInstance(context);
        const res = await axiosInstance.get('');
        return res.data;
    }

    static async getOne(context: NextPageContext, id: number): Promise<PoliticianDto | null> {
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
