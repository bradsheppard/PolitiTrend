import axios, { AxiosRequestConfig } from 'axios'
import getConfig from 'next/config'
import Politician from './model/Politician'

interface ResponseDto {
    data: Politician[]
    meta: {
        count: number
    }
}

const { publicRuntimeConfig } = getConfig()

class PoliticianApi {
    private static url = `http://${publicRuntimeConfig.appUrl}/api/politicians`

    private static async submitRequest(config: AxiosRequestConfig = {}) {
        return await axios.get<ResponseDto>(this.url, config)
    }

    static async get(): Promise<Politician[]> {
        const res = await this.submitRequest()
        return res.data.data
    }

    static async getOne(id: number): Promise<Politician | null> {
        const res = await axios.get<Politician>(`${this.url}/${id}`)

        if (res.status === 200) return res.data

        return null
    }

    static async getPresidents(): Promise<ResponseDto> {
        const res = await this.submitRequest({
            params: {
                'role[]': ['President', 'Former%20President'],
            },
        })

        return res.data
    }

    static async getSenators(limit: number, offset = 0): Promise<ResponseDto> {
        const res = await this.submitRequest({
            params: {
                limit,
                offset,
                'role[]': 'Senator',
            },
        })

        return res.data
    }

    static async getSenatorsByName(name: string, limit: number, offset = 0): Promise<ResponseDto> {
        const res = await this.submitRequest({
            params: {
                limit,
                offset,
                name,
                'role[]': 'Senator',
            },
        })

        return res.data
    }

    static async getCongressMembers(limit: number, offset = 0): Promise<ResponseDto> {
        const res = await this.submitRequest({
            params: {
                limit,
                offset,
                'role[]': 'Congressman',
            },
        })

        return res.data
    }

    static async getCongressMembersByName(
        name: string,
        limit: number,
        offset = 0
    ): Promise<ResponseDto> {
        const res = await this.submitRequest({
            params: {
                limit,
                offset,
                name,
                'role[]': 'Congressman',
            },
        })

        return res.data
    }
}

export default PoliticianApi
