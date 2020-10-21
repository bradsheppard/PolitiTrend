import PoliticianDto from '../politician/PoliticianDto'

interface NewsArticleDto {
    id: number
    url: string
    source: string
    summary: string
    dateTime: string
    politicians: PoliticianDto[]
}

export default NewsArticleDto
