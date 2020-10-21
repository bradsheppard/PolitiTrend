import axios, { AxiosInstance } from 'axios'
import PoliticianDto from './PoliticianDto'
import { url } from '../Utils'

class PoliticianApi {
    private static url = `http://${url}/api/politicians`

    static async get(): Promise<PoliticianDto[]> {
        const axiosInstance = this.createAxiosInstance()
        const res = await axiosInstance.get('')
        return res.data
    }

    static async getOne(id: any): Promise<PoliticianDto | null> {
        const axiosInstance = this.createAxiosInstance()
        const res = await axiosInstance.get(`/${id}`)

        if (res.status === 200) return res.data

        return null
    }

    private static createAxiosInstance(): AxiosInstance {
        return axios.create({ baseURL: this.url })
    }
}

export default PoliticianApi
