interface GlobalWordCloudDto {
    words: WordDto[]
}

interface WordDto {
    word: string
    count: number
}

export default GlobalWordCloudDto
