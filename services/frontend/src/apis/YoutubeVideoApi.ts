import axios, { AxiosInstance } from 'axios'
import YoutubeVideo from './model/YoutubeVideo'

interface SearchYoutubeVideoDto {
    limit?: number
    offset?: number
    politician?: number
}

class YoutubeVideoApi {
    private static url = `http://${process.env.NEXT_PUBLIC_APP_URL}/api/videos/youtube`

    static async get(searchYoutubeVideoDto: SearchYoutubeVideoDto): Promise<YoutubeVideo[]> {
        const axiosInstance = this.createAxiosInstance()
        const res = await axiosInstance.get<YoutubeVideo[]>('', {
            params: searchYoutubeVideoDto,
        })
        return res.data
    }

    private static createAxiosInstance(): AxiosInstance {
        return axios.create({ baseURL: this.url })
    }
}

export default YoutubeVideoApi
