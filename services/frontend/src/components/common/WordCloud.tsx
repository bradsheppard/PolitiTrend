import * as React from 'react';
import ReactWordcloud, { MinMaxPair, Spiral, Word } from 'react-wordcloud';

const wordCloudOptions = {
	enableTooltip: false,
	deterministic: false,
	fontSizes: [20, 75] as MinMaxPair,
	fontStyle: 'normal',
	padding: 1,
	rotations: 1,
	rotationAngles: [0, 0] as MinMaxPair,
	spiral: Spiral.Archimedean,
	transitionDuration: 1000,
};

interface WordCount {
	word: string;
	count: number;
}

interface IProps {
	wordCounts: WordCount[];
}

const WordCloud = (props: IProps) => {
	const words = props.wordCounts.map(x => {
		return {
			text: x.word,
			value: x.count
		} as Word
	});

	return (
		<ReactWordcloud words={words} options={wordCloudOptions} />
	);
};

export default WordCloud;
