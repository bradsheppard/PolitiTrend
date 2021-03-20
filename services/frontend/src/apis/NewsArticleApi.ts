import axios, { AxiosInstance } from 'axios'
import NewsArticle from './model/NewsArticle'

interface SearchNewsArticleDto {
    limit?: number
    offset?: number
    limitPerPolitician?: number
    politician?: number
}

class NewsArticleApi {
    private static url = `http://${process.env.NEXT_PUBLIC_APP_URL}/api/newsarticles`

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
