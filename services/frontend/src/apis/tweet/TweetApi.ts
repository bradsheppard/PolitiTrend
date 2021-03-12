import axios, { AxiosInstance } from 'axios'
import TweetDto from './TweetDto'
import SearchTweetDto from './SearchTweetDto'

class TweetApi {
    private static url = `http://${process.env.NEXT_PUBLIC_APP_URL}/api/tweets`

    static async get(searchTweetDto?: SearchTweetDto): Promise<TweetDto[]> {
        const axiosInstance = this.createAxiosInstance()
        const res = await axiosInstance.get<TweetDto[]>('', { params: searchTweetDto })
        return res.data
    }

    static async getOne(id: number): Promise<TweetDto | null> {
        const axiosInstance = this.createAxiosInstance()
        const res = await axiosInstance.get<TweetDto>(`/${id}`)

        if (res.status === 200) return res.data

        return null
    }

    private static createAxiosInstance(): AxiosInstance {
        return axios.create({ baseURL: this.url })
    }
}

export default TweetApi
