import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import NewsArticle from '../../apis/model/NewsArticle'

interface NewsArticleResponse {
    id: number
    url: string
    source: string
    summary: string
    dateTime: string
    politicians: number[]
}

interface Politician {
    id: number
    name: string
    party: string
    role: string
}

interface Response {
    data: Politician[]
    meta: {
        count: number
    }
}

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<NewsArticle[]>
): Promise<void> {
    const newsArticleAxiosResponse = await axios.get<NewsArticleResponse[]>('http://news-article', {
        params: req.query,
    })
    const politicianAxiosResponse = await axios.get<Response>('http://politician')

    const newsArticles = newsArticleAxiosResponse.data.map((newsArticleDto) => {
        const politicians = politicianAxiosResponse.data.data.filter((politicianDto) =>
            newsArticleDto.politicians.includes(politicianDto.id)
        )

        return { ...newsArticleDto, politicians }
    })

    res.json(newsArticles)
}
