import axios, { AxiosInstance } from 'axios'
import PoliticianWordCloud from './model/PoliticianWordCloud'

interface SearchPoliticianWordCloudDto {
    limit?: number
    politician?: number
}

class PoliticianWordCloudApi {
    private static url = `http://${process.env.NEXT_PUBLIC_APP_URL}/api/politicianwordclouds`

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
