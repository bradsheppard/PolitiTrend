import * as React from 'react';
import ReactWordcloud, { MinMaxPair, Spiral } from 'react-wordcloud';
import { extractWords, getWordCounts } from '../utils/StringHelper';

const wordCloudOptions = {
	colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'],
	enableTooltip: false,
	deterministic: false,
	fontFamily: 'impact',
	fontSizes: [15, 50] as MinMaxPair,
	fontStyle: 'normal',
	fontWeight: 'normal',
	padding: 1,
	rotations: 10,
	rotationAngles: [-75, 75] as MinMaxPair,
	spiral: Spiral.Archimedean,
	transitionDuration: 1000,
};

interface IProps {
	statements: string[];
	exclusion: string;
}

const WordCloud = (props: IProps) => {
	const words = getWordCounts(props.statements, extractWords(props.exclusion));

	return (
		<ReactWordcloud words={words} options={wordCloudOptions} />
	);
};

export default WordCloud;
