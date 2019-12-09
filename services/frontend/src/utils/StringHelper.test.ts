import { extractWords, getWordCounts, Word } from './StringHelper';

describe('String helper tests', () => {
    it('Extract words, can extract words', () => {
        const sentence = 'The quick brown fox';
        const words = extractWords(sentence);

        expect(words).toEqual(['The', 'quick', 'brown', 'fox']);
    });

    it('Extract words, drops punctuation', () => {
        const sentence = 'Whats up, dog?';
        const words = extractWords(sentence);

        expect(words).toEqual(['Whats', 'up', 'dog']);
    });

    it('Get word count', () => {
        const sentences = [
            'The quick brown fox',
            'The quick large fox'
        ];
        const words = getWordCounts(sentences);
        const expected = [
            <Word>{
                text: 'quick',
                value: 2
            },
            <Word>{
                text: 'brown',
                value: 1
            },
            <Word>{
                text: 'large',
                value: 1
            }
        ];

        expect(words).toEqual(expected);
    });

    it('Get word count, excludes exemptions', () => {
        const sentences = [
            'The quick brown fox',
            'The quick large fox'
        ];
        const words = getWordCounts(sentences, ['large']);
        const expected = [
            <Word>{
                text: 'quick',
                value: 2
            },
            <Word>{
                text: 'brown',
                value: 1
            }
        ];

        expect(words).toEqual(expected);
    });
});