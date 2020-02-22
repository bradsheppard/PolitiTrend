import axios, { AxiosInstance } from 'axios';
import OpinionSummaryDto from './OpinionSummaryDto';
import SearchOpinionSummaryDto from './SearchOpinionSummaryDto';
import { url } from '../Utils';

class OpinionSummaryApi {

	private static url = `http://${url}/api/opinions/opinionsummarys`;

	static async get(searchOpinionSummaryDto?: SearchOpinionSummaryDto): Promise<OpinionSummaryDto[]> {
		const axiosInstance = this.createAxiosInstance();
		const res = await axiosInstance.get('', {params: searchOpinionSummaryDto});
		return res.data;
	}

	static async getOne(id: number): Promise<OpinionSummaryDto | null> {
		const axiosInstance = this.createAxiosInstance();
		const res = await axiosInstance.get(`/${id}`);

		if(res.status === 200)
			return res.data;

		return null;
	}

	private static createAxiosInstance(): AxiosInstance {
		return axios.create({baseURL: this.url});
	}
}

export default OpinionSummaryApi;
