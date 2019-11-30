import * as React from 'react';
import { createStyles, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import PoliticianOpinions from '../model/PoliticianOpinions';
import { politicianNameToImagePath } from '../utils/ImagePath';
import ReactWordcloud from 'react-wordcloud';

const styles = (theme: Theme) => createStyles({
    container: {
        margin: theme.spacing(4),
        textAlign: 'center'
    }
});

interface IProps extends WithStyles<typeof styles> {
    politicianOpinions: PoliticianOpinions
}

const PoliticianDetails = (props: IProps) => {
    const { politicianOpinions, classes } = props;
    const { politician } = politicianOpinions;
    const words = getWordCounts(politicianOpinions.opinions.map(opinion => opinion.tweetText));

    return (
        <div className={classes.container}>
            <img src={politicianNameToImagePath(politician.name)} alt={politician.name} />
            <Typography variant='h4' color='primary'>
                {politician.name}
            </Typography>
            <Typography variant='h5' color='primary'>
                {politician.party}
            </Typography>
            <ReactWordcloud words={words} />
        </div>
    );
};

interface Word {
    text: string;
    value: number;
}

function getWordCounts(tweets: Array<string>): Array<Word> {
    const results: {[index: string]: number} = {};
    tweets.forEach(tweet => {
        const words = tweet.split(' ');
        words.forEach(word => {
            if (word.length < 5)
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

    return words;
}

export default withStyles(styles)(PoliticianDetails);