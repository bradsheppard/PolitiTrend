import GlobalWordCloud from './model/GlobalWordCloud'
import axios, { AxiosInstance } from 'axios'

interface SearchGlobalWordCloudDto {
    limit?: number
}

class GlobalWordCloudApi {
    private static url = `http://${process.env.NEXT_PUBLIC_APP_URL}/api/globalwordclouds`

    static async get(searchWordCloudDto?: SearchGlobalWordCloudDto): Promise<GlobalWordCloud[]> {
        const axiosInstance = this.createAxiosInstance()
        const res = await axiosInstance.get<GlobalWordCloud[]>('', {
            params: searchWordCloudDto,
        })
        return res.data
    }

    private static createAxiosInstance(): AxiosInstance {
        return axios.create({ baseURL: this.url })
    }
}

export default GlobalWordCloudApi
