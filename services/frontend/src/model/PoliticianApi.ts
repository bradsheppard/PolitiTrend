import Politician from './Politician';
import fetch from 'isomorphic-unfetch';
import { NextPageContext } from 'next';
import absoluteUrl from '../utils/absoluteUrl';

class PoliticianApi {

    static async get(context: NextPageContext): Promise<Array<Politician>> {
        const { origin } = absoluteUrl(context.req);
        const res = await fetch(`${origin}/api/politician`);
        return await res.json();
    }
}

export default PoliticianApi;