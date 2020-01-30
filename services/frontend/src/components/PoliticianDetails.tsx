import * as React from 'react';
import { Card, createStyles, Divider, Grid, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import { politicianNameToImagePath } from '../utils/ImagePath';
import ReactWordcloud, { MinMaxPair, Spiral } from 'react-wordcloud';
import { Tweet as TweetWidget } from 'react-twitter-widgets'
import { extractWords, getWordCounts } from '../utils/StringHelper';
import { Chart } from 'react-google-charts';

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

interface Politician {
    name: string;
    party: string;
    sentiment: number;
    tweets: Tweet[];
    sentimentHistory: OpinionSummary[];
}

interface Tweet {
    tweetId: string;
    tweetText: string;
}

interface OpinionSummary {
    sentiment: number;
    dateTime: string;
}

interface IProps extends WithStyles<typeof styles> {
    politician: Politician
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
    const { politician, classes } = props;
    const tweetTexts = politician.tweets.map(tweet => tweet.tweetText);
    const words = getWordCounts(tweetTexts, extractWords(politician.name));

    const { tweets } = politician;
    const firstHalfTweets = politician.tweets.slice(0, tweets.length / 2);
    const secondHalfTweets = politician.tweets.slice(tweets.length / 2, tweets.length);

    const lineChartData = politician.sentimentHistory.map((opinionSummary: OpinionSummary) => {
        return [new Date(opinionSummary.dateTime), opinionSummary.sentiment]
    });

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
                    <Typography variant='subtitle1' color='primary'>
                        Score: {politician.sentiment.toFixed(1)}
                    </Typography>
                </Grid>
                <Grid item
                    sm={6}>
                    <ReactWordcloud words={words} options={wordCloudOptions} />
                </Grid>
                { lineChartData.length > 0 ?
                    (
                        <Grid item
                              sm={12}>
                            <Chart chartType="LineChart"
                                   data={[
                                       ['x', politician.name],
                                       ...lineChartData
                                   ]}
                                   width="100%"
                                   height='500px'
                                   options={{
                                       hAxis: {
                                           title: 'Time',
                                       },
                                       vAxis: {
                                           title: 'Popularity',
                                       },
                                   }}/>
                        </Grid>
                    ) : null
                }
                <Grid item
                      sm={12}>
                    <Divider variant="middle" className={classes.divider} />
                    <Grid container
                          alignItems='flex-start'
                          direction='row'
                          justify='center'>
                        <Grid item sm={6}>
                            {
                                firstHalfTweets.map((opinion: Tweet, index) => {
                                    return (
                                        <TweetWidget
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
                                secondHalfTweets.map((opinion: Tweet, index) => {
                                    return (
                                        <TweetWidget
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
