import Politician from './Politician'

interface NewsArticle {
    id: number
    url: string
    source: string
    summary: string
    dateTime: string
    politicians: Politician[]
}

export default NewsArticle
