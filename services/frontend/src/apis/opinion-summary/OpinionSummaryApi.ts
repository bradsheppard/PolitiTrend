import axios, { AxiosInstance } from 'axios';
import { NextPageContext } from 'next';
import absoluteUrl from '../../utils/absoluteUrl';
import OpinionSummaryDto from './OpinionSummaryDto';
import SearchOpinionSummaryDto from './SearchOpinionSummaryDto';

class OpinionSummaryApi {

	private static baseUrl = '/api/opinions/opinionsummarys';

	static async get(context: NextPageContext, searchOpinionSummaryDto?: SearchOpinionSummaryDto): Promise<OpinionSummaryDto[]> {
		const axiosInstance = this.createAxiosInstance(context);
		const res = await axiosInstance.get('', {params: searchOpinionSummaryDto});
		return res.data;
	}

	static async getOne(context: NextPageContext, id: number): Promise<OpinionSummaryDto | null> {
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

export default OpinionSummaryApi;
