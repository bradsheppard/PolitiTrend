import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import Politician from '../../model/Politician';
import OpinionSummaryDto from '../../dtos/OpinionSummaryDto';
import PoliticianDto from '../../dtos/PoliticianDto';
import OpinionDto from '../../dtos/OpinionDto';


export default async function handle(_req: NextApiRequest, res: NextApiResponse<Politician[]>) {
    const politicianAxiosResponse = await axios.get<PoliticianDto[]>('http://politician');
    const summaryAxiosResponse = await axios.get<OpinionSummaryDto[]>('http://opinion/opinionsummary?max=true');
    const opinionAxiosResponse = await axios.get<OpinionDto[]>('http://opinion');

    const politicians: Array<Politician> = [];

    politicianAxiosResponse.data.forEach((politicianDto: PoliticianDto) => {
        const politician = {
            id: politicianDto.id,
            party: politicianDto.party,
            name: politicianDto.name
        } as Politician;

        const summary: OpinionSummaryDto | undefined = summaryAxiosResponse.data.find(x => x.politician === politicianDto.id);
        politician.opinions = opinionAxiosResponse.data.filter(x => x.politician === politicianDto.id);

        if(!summary)
            return;

        politician.sentiment = summary.sentiment;

        politicians.push(politician);
    });

    res.status(200).json(politicians);
}
