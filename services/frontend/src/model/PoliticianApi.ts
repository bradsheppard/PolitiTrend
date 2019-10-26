import Politician from './Politician';
import fetch from 'isomorphic-unfetch';

class PoliticianApi {

    static async get(basepath: string): Promise<Array<Politician>> {
        const res = await fetch(`${basepath}/api/politician`);
        return await res.json();
    }
}

export default PoliticianApi;