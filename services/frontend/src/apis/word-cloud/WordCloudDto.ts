interface WordCloudDto {
    words: WordDto[];
}

interface WordDto {
    word: string;
    count: number;
}

export default WordCloudDto;
