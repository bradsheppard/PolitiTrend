import * as React from 'react';
import { Card, createStyles, Divider, Grid, Theme, withStyles, WithStyles } from '@material-ui/core';
import { Tweet as TweetWidget } from 'react-twitter-widgets'
import PoliticianAvatar from './PoliticianAvatar';
import WordCloud from './WordCloud';
import LineChart from './LineChart';

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

const PoliticianDetails = (props: IProps) => {
    const { politician, classes } = props;
    const tweetTexts = politician.tweets.map(tweet => tweet.tweetText);

    const { tweets } = politician;
    const firstHalfTweets = politician.tweets.slice(0, tweets.length / 2);
    const secondHalfTweets = politician.tweets.slice(tweets.length / 2, tweets.length);

    const lineChartData = politician.sentimentHistory.map((opinionSummary: OpinionSummary) => {
        return {date: new Date(opinionSummary.dateTime), value: opinionSummary.sentiment}
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
                    <PoliticianAvatar politician={politician} />
                </Grid>
                <Grid item
                    sm={6}>
                    <WordCloud statements={tweetTexts} exclusion={politician.name} />
                </Grid>
                { lineChartData.length > 0 ?
                    (
                        <Grid item
                              sm={12}>
                            <LineChart data={lineChartData} xAxis='Time' yAxis='Popularity'/>
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
