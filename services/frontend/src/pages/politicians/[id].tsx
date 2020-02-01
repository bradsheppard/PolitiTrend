import * as React from 'react';
import { Card, createStyles, Divider, Grid, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import { NextPageContext } from 'next';
import { Tweet as TweetWidget } from 'react-twitter-widgets'
import ContentContainer from '../../components/ContentContainer';
import PoliticianApi from '../../apis/politician/PoliticianApi';
import Bar from '../../components/Bar';
import PoliticianDto from '../../apis/politician/PoliticianDto';
import TweetApi from '../../apis/tweet/TweetApi';
import TweetDto from '../../apis/tweet/TweetDto';
import OpinionSummaryDto from '../../apis/opinion-summary/OpinionSummaryDto';
import OpinionSummaryApi from '../../apis/opinion-summary/OpinionSummaryApi';
import PoliticianAvatar from '../../components/PoliticianAvatar';
import WordCloud from '../../components/WordCloud';
import LineChart from '../../components/LineChart';

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

interface Tweet {
    tweetId: string;
    tweetText: string;
}

interface OpinionSummary {
    sentiment: number;
    dateTime: string;
}

interface Politician {
    name: string;
    party: string;
    sentiment: number;
    tweets: Tweet[];
    sentimentHistory: OpinionSummary[];
}

interface IProps extends WithStyles<typeof styles> {
    politician: Politician | null;
}

const PoliticianPage = (props: IProps) => {
    if(!props.politician)
        return (
            <Typography>Not Found</Typography>
        );

    const { politician, classes } = props;
    const tweetTexts = politician.tweets.map(tweet => tweet.tweetText);

    const { tweets } = politician;
    const firstHalfTweets = politician.tweets.slice(0, tweets.length / 2);
    const secondHalfTweets = politician.tweets.slice(tweets.length / 2, tweets.length);

    const lineChartData = politician.sentimentHistory.map((opinionSummary: OpinionSummary) => {
        return {date: new Date(opinionSummary.dateTime), value: opinionSummary.sentiment}
    });

    return (
        <React.Fragment>
            <Bar/>
            <ContentContainer>
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
            </ContentContainer>
        </React.Fragment>
    )
};

PoliticianPage.getInitialProps = async function(context: NextPageContext) {
    const { id } = context.query;
    if (typeof id === 'string') {
        const politicianDto: PoliticianDto | null = await PoliticianApi.getOne(context, parseInt(id));
        const tweetsDto: TweetDto[] = await TweetApi.getForPolitician(context, parseInt(id), 10);
        const opinionSummaryDtos: OpinionSummaryDto[] = await OpinionSummaryApi.getForPolitician(context, parseInt(id));
        opinionSummaryDtos.sort((a, b) => b.id - a.id);

        if(!politicianDto)
            return {
                politician: null
            };

        const politician: Politician = {
            name: politicianDto.name,
            party: politicianDto.party,
            tweets: tweetsDto,
            sentiment: opinionSummaryDtos.length > 0 ? opinionSummaryDtos[0].sentiment : 5,
            sentimentHistory: opinionSummaryDtos
        };

        return {
            politician
        };
    }
    else {
        return {
            politician: null
        }
    }
};

export default withStyles(styles)(PoliticianPage);
