import axios, { AxiosInstance } from 'axios'
import PartySentimentDto from './PartySentimentDto'

class PartySentimentApi {
    private static url = `http://${process.env.NEXT_PUBLIC_APP_URL}/api/partysentiment`
    private static LOOKBACK_DAYS = 30

    static async get(): Promise<PartySentimentDto[]> {
        const axiosInstance = this.createAxiosInstance()
        const res = await axiosInstance.get<PartySentimentDto[]>('')
        return res.data
    }

    static async getHistoryForParty(id: number): Promise<PartySentimentDto[]> {
        const axiosInstance = this.createAxiosInstance()
        const start = new Date()
        start.setDate(start.getDate() - PartySentimentApi.LOOKBACK_DAYS)

        const res = await axiosInstance.get<PartySentimentDto[]>('', {
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
