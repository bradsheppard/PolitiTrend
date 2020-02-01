import axios, { AxiosInstance } from 'axios';
import { NextPageContext } from 'next';
import absoluteUrl from '../../utils/absoluteUrl';
import TweetDto from './TweetDto';
import SearchTweetDto from './SearchTweetDto';

class TweetApi {

	private static baseUrl = '/api/opinions/tweets';

	static async get(context: NextPageContext, searchTweetDto?: SearchTweetDto): Promise<TweetDto[]> {
		const axiosInstance = this.createAxiosInstance(context);
		const res = await axiosInstance.get<TweetDto[]>('', {params: searchTweetDto});
		return res.data;
	}

	static async getOne(context: NextPageContext, id: number): Promise<TweetDto | null> {
		const axiosInstance = this.createAxiosInstance(context);
		const res = await axiosInstance.get<TweetDto>(`/${id}`);

		if(res.status === 200)
			return res.data;

		return null;
	}

	static async getForPolitician(context: NextPageContext, politicianId: number, limit: number): Promise<TweetDto[]> {
		const axiosInstance = this.createAxiosInstance(context);
		const res = await axiosInstance.get<TweetDto[]>('', {
			params: {
				politicians: [politicianId],
				limit
			}
		});

		return res.data;
	}

	private static createAxiosInstance(context: NextPageContext): AxiosInstance {
		const { origin } = absoluteUrl(context.req);
		const prefix = `${origin}${this.baseUrl}`;

		return axios.create({baseURL: prefix});
	}
}

export default TweetApi;
