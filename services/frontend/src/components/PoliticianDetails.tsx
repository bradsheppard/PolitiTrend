import * as React from 'react';
import { Card, createStyles, Divider, Grid, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import PoliticianOpinions from '../model/PoliticianOpinions';
import { politicianNameToImagePath } from '../utils/ImagePath';
import ReactWordcloud, { MinMaxPair, Spiral } from 'react-wordcloud';
import Opinion from '../model/Opinion';
import { Tweet } from 'react-twitter-widgets'
import { extractWords, getWordCounts } from '../utils/StringHelper';

const styles = (theme: Theme) => createStyles({
    container: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
        textAlign: 'center'
    },
    divider: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6)
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
    const tweets = politicianOpinions.opinions.map(opinion => opinion.tweetText);
    const words = getWordCounts(tweets, extractWords(politician.name));

    const { opinions } = politicianOpinions;
    const firstHalfTweets = politicianOpinions.opinions.slice(0, opinions.length / 2);
    const secondHalfTweets = politicianOpinions.opinions.slice(opinions.length / 2, opinions.length);

    return (
        <Card>
            <Grid container
                  className={classes.container}
                  alignItems='center'
                  direction='row'
                  justify='center'>
                <Grid item
                    sm={6}>
                    <img src={politicianNameToImagePath(politician.name)} alt={politician.name} />
                    <Typography variant='h4' color='primary'>
                        {politician.name}
                    </Typography>
                    <Typography variant='h5' color='primary'>
                        {politician.party}
                    </Typography>
                </Grid>
                <Grid item
                    sm={6}>
                    <ReactWordcloud words={words} options={wordCloudOptions} />
                </Grid>
                <Grid item
                      sm={12}>
                    <Divider variant="middle" className={classes.divider} />
                    <Grid container
                          alignItems='flex-start'
                          direction='row'
                          justify='center'>
                        <Grid item sm={6}>
                            {
                                firstHalfTweets.map((opinion: Opinion, index) => {
                                    return (
                                        <Tweet
                                            options={{
                                                align: 'center'
                                            }}
                                            tweetId={opinion.tweetId}
                                            key={index}
                                        />
                                    )
                                })
                            }
                        </Grid>
                        <Grid item sm={6}>
                            {
                                secondHalfTweets.map((opinion: Opinion, index) => {
                                    return (
                                        <Tweet
                                            options={{
                                                align: 'center'
                                            }}
                                            tweetId={opinion.tweetId}
                                            key={index}
                                        />
                                    )
                                })
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    );
};

export default withStyles(styles)(PoliticianDetails);