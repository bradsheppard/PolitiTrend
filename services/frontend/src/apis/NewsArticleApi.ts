import axios, { AxiosInstance } from 'axios'
import NewsArticle from './model/NewsArticle'
import getConfig from 'next/config'

interface SearchNewsArticleDto {
    limit?: number
    offset?: number
    limitPerPolitician?: number
    politician?: number
}

const { publicRuntimeConfig } = getConfig()

class NewsArticleApi {
    private static url = `http://${publicRuntimeConfig.appUrl}/api/newsarticles`

    static async get(searchNewsArticleDto?: SearchNewsArticleDto): Promise<NewsArticle[]> {
        const axiosInstance = this.createAxiosInstance()
        const res = await axiosInstance.get<NewsArticle[]>('', { params: searchNewsArticleDto })
        return res.data
    }

    private static createAxiosInstance(): AxiosInstance {
        return axios.create({ baseURL: this.url })
    }
}

export default NewsArticleApi
