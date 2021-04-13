import axios, { AxiosInstance } from 'axios'
import PoliticianWordCloud from './model/PoliticianWordCloud'
import getConfig from 'next/config'

interface SearchPoliticianWordCloudDto {
    limit?: number
    politician?: number
}

const { publicRuntimeConfig } = getConfig()

class PoliticianWordCloudApi {
    private static url = `http://${publicRuntimeConfig.appUrl}/api/politicianwordclouds`

    static async get(
        searchWordCloudDto?: SearchPoliticianWordCloudDto
    ): Promise<PoliticianWordCloud[]> {
        const axiosInstance = this.createAxiosInstance()
        const res = await axiosInstance.get<PoliticianWordCloud[]>('', {
            params: searchWordCloudDto,
        })
        return res.data
    }

    private static createAxiosInstance(): AxiosInstance {
        return axios.create({ baseURL: this.url })
    }
}

export default PoliticianWordCloudApi
