import * as React from 'react';
import { createStyles, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import PoliticianOpinions from '../model/PoliticianOpinions';
import { politicianNameToImagePath } from '../utils/ImagePath';
import ReactWordcloud, { MinMaxPair, Spiral } from 'react-wordcloud';

const styles = (theme: Theme) => createStyles({
    container: {
        margin: theme.spacing(4),
        textAlign: 'center'
    }
});

interface IProps extends WithStyles<typeof styles> {
    politicianOpinions: PoliticianOpinions
}

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

const PoliticianDetails = (props: IProps) => {
    const { politicianOpinions, classes } = props;
    const { politician } = politicianOpinions;
    const words = getWordCounts(politicianOpinions.opinions.map(opinion => opinion.tweetText), politicianOpinions.politician.name);

    return (
        <div className={classes.container}>
            <img src={politicianNameToImagePath(politician.name)} alt={politician.name} />
            <Typography variant='h4' color='primary'>
                {politician.name}
            </Typography>
            <Typography variant='h5' color='primary'>
                {politician.party}
            </Typography>
            <ReactWordcloud words={words} options={wordCloudOptions} />
        </div>
    );
};

interface Word {
    text: string;
    value: number;
}

function getWordCounts(tweets: Array<string>, politicianName: string): Array<Word> {
    const results: {[index: string]: number} = {};
    tweets.forEach(tweet => {
        const words = tweet.split(' ');
        words.forEach(word => {
            if (word.length < 5 || politicianName.includes(word))
                return;
            if(!results[word])
                results[word] = 1;
            else
                results[word]++;
        });
    });

    const words: Array<Word> = [];
    Object.keys(results).forEach(key => {
        words.push({text: key, value: results[key]})
    });

    words.sort((a, b) => b.value - a.value);
    return words.slice(0, Math.min(30, words.length));
}

export default withStyles(styles)(PoliticianDetails);