import axios, { AxiosInstance } from 'axios'
import PartySentiment from './model/PartySentiment'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

interface SearchPartySentimentDto {
    start: Date
}

class PartySentimentApi {
    private static url = `http://${publicRuntimeConfig.appUrl}/api/partysentiment`
    private static LOOKBACK_DAYS = 30

    static async get(searchPartySentimentDto?: SearchPartySentimentDto): Promise<PartySentiment[]> {
        const axiosInstance = this.createAxiosInstance()
        const res = await axiosInstance.get<PartySentiment[]>('', {
            params: searchPartySentimentDto,
        })
        return res.data
    }

    static async getHistoryForParty(id: number): Promise<PartySentiment[]> {
        const axiosInstance = this.createAxiosInstance()
        const start = new Date()
        start.setDate(start.getDate() - PartySentimentApi.LOOKBACK_DAYS)

        const res = await axiosInstance.get<PartySentiment[]>('', {
            params: {
                party: id,
                start,
            },
        })
        return res.data
    }

    private static createAxiosInstance(): AxiosInstance {
        return axios.create({ baseURL: this.url })
    }
}

export default PartySentimentApi
