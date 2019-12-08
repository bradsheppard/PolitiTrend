function extractWords(sentence: string): Array<string> {
    const match = sentence.match(/\w+(?:'\w+)*/g);
    if (!match)
        return [];
    return match;
}

interface WordCount {
    text: string;
    value: number;
}

const ignoredWords = ['https'];

function getWordCounts(sentences: Array<string>, exemptions?: Array<string>): Array<WordCount> {
    const results: {[index: string]: number} = {};
    sentences.forEach(sentence => {
        const words = extractWords(sentence);
        words.forEach(word => {
            if (word.length < 5 || (exemptions && exemptions.includes(word)) || ignoredWords.includes(word))
                return;
            if(!results[word])
                results[word] = 1;
            else
                results[word]++;
        });
    });

    const words: Array<WordCount> = [];
    Object.keys(results).forEach(key => {
        words.push({text: key, value: results[key]})
    });

    words.sort((a, b) => b.value - a.value);
    return words.slice(0, Math.min(25, words.length));
}

export { extractWords, getWordCounts }
export type Word = WordCount;