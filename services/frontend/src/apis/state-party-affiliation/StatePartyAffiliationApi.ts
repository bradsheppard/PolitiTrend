import StatePartyAffiliationDto from './StatePartyAffiliationDto'
import axios, { AxiosInstance } from 'axios'

class StatePartyAffiliationApi {
    private static url = `http://${process.env.NEXT_PUBLIC_APP_URL}/api/statepartyaffiliations`

    static async get(): Promise<StatePartyAffiliationDto[]> {
        const axiosInstance = this.createAxiosInstance()
        const res = await axiosInstance.get<StatePartyAffiliationDto[]>('')
        return res.data
    }

    private static createAxiosInstance(): AxiosInstance {
        return axios.create({ baseURL: this.url })
    }
}

export default StatePartyAffiliationApi
