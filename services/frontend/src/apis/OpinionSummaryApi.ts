import axios, { AxiosInstance } from 'axios';
import { NextPageContext } from 'next';
import absoluteUrl from '../utils/absoluteUrl';
import OpinionSummaryDto from './OpinionSummaryDto';

class OpinionSummaryApi {

	private static baseUrl = '/api/opinions/opinionsummarys';

	static async get(context: NextPageContext): Promise<OpinionSummaryDto[]> {
		const axiosInstance = this.createAxiosInstance(context);
		const res = await axiosInstance.get('');
		return res.data;
	}

	static async getOne(context: NextPageContext, id: number): Promise<OpinionSummaryDto | null> {
		const axiosInstance = this.createAxiosInstance(context);
		const res = await axiosInstance.get(`/${id}`);

		if(res.status === 200)
			return res.data;

		return null;
	}

	static async getMaxForPolitician(context: NextPageContext, politicianId: number): Promise<OpinionSummaryDto | null> {
		const axiosInstance = this.createAxiosInstance(context);
		const res = await axiosInstance.get<OpinionSummaryDto[]>('', {params: {max: true, politician: politicianId}});

		const opinionSummarys: OpinionSummaryDto[] = res.data;
		if(opinionSummarys.length > 0)
			return opinionSummarys[0];

		return null;
	}

	static async getForPolitician(context: NextPageContext, politicianId: number): Promise<OpinionSummaryDto[]> {
		const axiosInstance = this.createAxiosInstance(context);
		const res = await axiosInstance.get<OpinionSummaryDto[]>('', {params: {politician: politicianId}});

		return res.data;
	}

	private static createAxiosInstance(context: NextPageContext): AxiosInstance {
		const { origin } = absoluteUrl(context.req);
		const prefix = `${origin}${this.baseUrl}`;

		return axios.create({baseURL: prefix});
	}
}

export default OpinionSummaryApi;
