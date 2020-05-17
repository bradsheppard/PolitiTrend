import * as React from 'react';
import WordCloud from '../common/WordCloud';

interface IProps {
    wordCounts: WordCount[];
}

interface WordCount {
    word: string;
    count: number;
}

const PoliticianStatsFeed = (props: IProps) => {

    return (
        <React.Fragment>
            <WordCloud wordCounts={props.wordCounts} />
        </React.Fragment>
    )
};

export default PoliticianStatsFeed;
