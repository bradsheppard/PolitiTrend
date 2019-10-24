import axios, {AxiosResponse} from 'axios';
import Repository from './Repository';
import Politician from './Politician';

class PoliticianRepository implements Repository<Politician> {

    async get(): Promise<Politician[]> {
        const response = await axios.get<Politician[]>('/politician');

        return this.handleResponse(response);
    }

    private handleResponse(response: AxiosResponse<Politician[]>): Array<Politician> {
        const results: Array<Politician> = [];

        response.data.forEach((politician: Politician) => {
            results.push({
                name: politician.name,
                party: politician.party,
                sentiment: politician.sentiment
            })
        });

        return results;
    }
}

export default PoliticianRepository;