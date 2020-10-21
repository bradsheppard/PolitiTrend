import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import NewsArticleDto from '../../apis/news-article/NewsArticleDto'

interface NewsArticle {
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

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<NewsArticleDto[]>
): Promise<void> {
    const newsArticleAxiosResponse = await axios.get<NewsArticle[]>('http://news-article', {
        params: req.query,
    })
    const politicianAxiosResponse = await axios.get<Politician[]>('http://politician', {
        params: req.query,
    })

    const newsArticles = newsArticleAxiosResponse.data.map((newsArticleDto) => {
        const politicians = politicianAxiosResponse.data.filter((politicianDto) =>
            newsArticleDto.politicians.includes(politicianDto.id)
        )
        return { ...newsArticleDto, politicians }
    })

    res.json(newsArticles)
}
