import GlobalWordCloud from './model/GlobalWordCloud'
import axios, { AxiosInstance } from 'axios'
import getConfig from 'next/config'

interface SearchGlobalWordCloudDto {
    limit?: number
}

const { publicRuntimeConfig } = getConfig()

class GlobalWordCloudApi {
    private static url = `http://${publicRuntimeConfig.appUrl}/api/globalwordclouds`

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
