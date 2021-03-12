import GlobalWordCloudDto from './GlobalWordCloudDto'
import SearchGlobalWordCloudDto from './SearchGlobalWordCloudDto'
import axios, { AxiosInstance } from 'axios'

class GlobalWordCloudApi {
    private static url = `http://${process.env.NEXT_PUBLIC_APP_URL}/api/globalwordclouds`

    static async get(searchWordCloudDto?: SearchGlobalWordCloudDto): Promise<GlobalWordCloudDto[]> {
        const axiosInstance = this.createAxiosInstance()
        const res = await axiosInstance.get<GlobalWordCloudDto[]>('', {
            params: searchWordCloudDto,
        })
        return res.data
    }

    private static createAxiosInstance(): AxiosInstance {
        return axios.create({ baseURL: this.url })
    }
}

export default GlobalWordCloudApi
