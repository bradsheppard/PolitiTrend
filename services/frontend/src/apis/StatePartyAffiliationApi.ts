import StatePartyAffiliation from './model/StatePartyAffiliation'
import axios, { AxiosInstance } from 'axios'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

class StatePartyAffiliationApi {
    private static url = `http://${publicRuntimeConfig.appUrl}/api/statepartyaffiliations`

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
