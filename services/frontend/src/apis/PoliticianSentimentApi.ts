import axios, { AxiosInstance } from 'axios'
import PoliticianSentiment from './model/PoliticianSentiment'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

class PoliticianSentimentApi {
    private static url = `http://${publicRuntimeConfig.appUrl}/api/politiciansentiment`
    private static LOOKBACK_DAYS = 30

    static async get(): Promise<PoliticianSentiment[]> {
        const axiosInstance = this.createAxiosInstance()
        const res = await axiosInstance.get<PoliticianSentiment[]>('')
        return res.data
    }

    static async getHistoryForPolitician(id: number): Promise<PoliticianSentiment[]> {
        const axiosInstance = this.createAxiosInstance()
        const start = new Date()
        start.setDate(start.getDate() - PoliticianSentimentApi.LOOKBACK_DAYS)

        const res = await axiosInstance.get<PoliticianSentiment[]>('', {
            params: {
                politician: id,
                start,
            },
        })
        return res.data
    }

    private static createAxiosInstance(): AxiosInstance {
        return axios.create({ baseURL: this.url })
    }
}

export default PoliticianSentimentApi
