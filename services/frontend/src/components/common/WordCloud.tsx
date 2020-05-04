import * as React from 'react';
import ReactWordcloud, { MinMaxPair, Scale, Spiral, Word } from 'react-wordcloud';

const wordCloudOptions = {
	enableTooltip: false,
	deterministic: true,
	colors: ['black', '#9c0500', '#00099c'],
	fontSizes: [30, 55] as MinMaxPair,
	fontFamily: 'Raleway',
	fontStyle: 'normal',
	padding: 6,
	rotations: 6,
	rotationAngles: [-45, 45] as MinMaxPair,
	spiral: Spiral.Archimedean,
	scale: Scale.Sqrt,
	transitionDuration: 2000
};

interface WordCount {
	word: string;
	count: number;
}

interface IProps {
	wordCounts: WordCount[];
}

const WordCloud = (props: IProps & React.HTMLAttributes<HTMLDivElement>) => {
	const words = props.wordCounts.map(x => {
		return {
			text: x.word,
			value: x.count
		} as Word
	});

	return (
		<div className={props.className}>
			<ReactWordcloud words={words} options={wordCloudOptions} />
		</div>
	);
};

export default WordCloud;
