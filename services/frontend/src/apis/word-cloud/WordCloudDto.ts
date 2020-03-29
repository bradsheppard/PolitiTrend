interface WordCloudDto {
    politician: number;
    words: WordDto[];
}

interface WordDto {
    word: string;
    count: number;
}

export default WordCloudDto;
