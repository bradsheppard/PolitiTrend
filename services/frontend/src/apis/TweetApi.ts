import axios, { AxiosInstance } from 'axios'
import Tweet from './model/Tweet'

interface SearchTweetDto {
    limit?: number
    limitPerPolitician?: number
    politician?: number
}

class TweetApi {
    private static url = `http://${process.env.NEXT_PUBLIC_APP_URL}/api/tweets`

    static async get(searchTweetDto?: SearchTweetDto): Promise<Tweet[]> {
        const axiosInstance = this.createAxiosInstance()
        const res = await axiosInstance.get<Tweet[]>('', { params: searchTweetDto })
        return res.data
    }

    static async getOne(id: number): Promise<Tweet | null> {
        const axiosInstance = this.createAxiosInstance()
        const res = await axiosInstance.get<Tweet>(`/${id}`)

        if (res.status === 200) return res.data

        return null
    }

    private static createAxiosInstance(): AxiosInstance {
        return axios.create({ baseURL: this.url })
    }
}

export default TweetApi
