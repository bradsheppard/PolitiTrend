import StatePartyAffiliation from './model/StatePartyAffiliation'
import axios, { AxiosInstance } from 'axios'

class StatePartyAffiliationApi {
    private static url = `http://${process.env.NEXT_PUBLIC_APP_URL}/api/statepartyaffiliations`

    static async get(): Promise<StatePartyAffiliation[]> {
        const axiosInstance = this.createAxiosInstance()
        const res = await axiosInstance.get<StatePartyAffiliation[]>('')
        return res.data
    }

    private static createAxiosInstance(): AxiosInstance {
        return axios.create({ baseURL: this.url })
    }
}

export default StatePartyAffiliationApi
