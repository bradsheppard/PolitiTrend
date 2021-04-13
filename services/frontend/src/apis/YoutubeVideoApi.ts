import axios, { AxiosInstance } from 'axios'
import YoutubeVideo from './model/YoutubeVideo'
import getConfig from 'next/config'

interface SearchYoutubeVideoDto {
    limit?: number
    offset?: number
    politician?: number
}

const { publicRuntimeConfig } = getConfig()

class YoutubeVideoApi {
    private static url = `http://${publicRuntimeConfig.appUrl}/api/videos/youtube`

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
