import axios from 'axios';
import { NextPageContext } from 'next';
import absoluteUrl from '../utils/absoluteUrl';
import PoliticianOpinions from './PoliticianOpinions';

class PoliticianOpinionsApi {

    static async getOne(context: NextPageContext, id: number): Promise<PoliticianOpinions | null> {
        const { origin } = absoluteUrl(context.req);
        const axiosInstance = axios.create({baseURL: `${origin}/api/politicians`});

        const response = await axiosInstance.get<PoliticianOpinions>(`${id}/opinions`);

        if(response.status === 200)
            return response.data;

        return null;
    }
}

export default PoliticianOpinionsApi;