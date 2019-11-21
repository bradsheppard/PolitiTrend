import fetch from 'isomorphic-unfetch';
import { NextPageContext } from 'next';
import absoluteUrl from '../utils/absoluteUrl';
import Opinion from './Opinion';

class OpinionApi {

    static async get(context: NextPageContext): Promise<Array<Opinion>> {
        const { origin } = absoluteUrl(context.req);
        const res = await fetch(`${origin}/api/opinion`);
        return await res.json();
    }
}

export default OpinionApi;