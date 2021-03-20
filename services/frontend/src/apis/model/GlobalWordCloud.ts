interface GlobalWordCloud {
    words: WordDto[]
}

interface WordDto {
    word: string
    count: number
}

export default GlobalWordCloud
