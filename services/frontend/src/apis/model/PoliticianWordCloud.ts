interface PoliticianWordCloud {
    words: WordDto[]
    politician: number
}

interface WordDto {
    word: string
    count: number
}

export default PoliticianWordCloud
