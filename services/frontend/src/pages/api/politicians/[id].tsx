import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import Politician from '../../../model/Politician';
import PoliticianDto from '../../../dtos/PoliticianDto';
import OpinionSummaryDto from '../../../dtos/OpinionSummaryDto';
import OpinionDto from '../../../dtos/OpinionDto';

export default async function handle(req: NextApiRequest, res: NextApiResponse<Politician>) {
    const { query: { id } } = req;
    const politicianAxiosResponse = await axios.get<PoliticianDto>(`http://politician/${id}`);
    const summaryAxiosResponse = await axios.get<OpinionSummaryDto[]>(`http://opinion/opinionsummary?max=true&politician=${id}`);
    const opinionAxiosResponse = await axios.get<OpinionDto[]>(`http://opinion?politician=${id}`);

    const politicianDto = politicianAxiosResponse.data;
    const summaryDtos: OpinionSummaryDto[] = summaryAxiosResponse.data;
    const opinionDtos: OpinionDto[] = opinionAxiosResponse.data;

    const politician = {
        id: politicianDto.id,
        party: politicianDto.party,
        name: politicianDto.name,
        opinions: opinionDtos,
        sentiment: summaryDtos[0].sentiment
    } as Politician;


    res.status(200).json(politician);
}
