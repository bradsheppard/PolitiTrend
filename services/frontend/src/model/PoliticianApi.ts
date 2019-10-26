import Politician from './Politician';
import fetch from 'isomorphic-unfetch';

class PoliticianApi {

    static async get(): Promise<Array<Politician>> {
        const res = await fetch('http://politician');
        return await res.json();
    }
}

export default PoliticianApi;