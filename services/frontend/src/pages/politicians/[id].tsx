import * as React from 'react';
import { Card, createStyles, Grid, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
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
import LineChart from '../../components/LineChart';

const styles = (theme: Theme) => createStyles({
    profile: {
        marginTop: theme.spacing(4),
        textAlign: 'center'
    },
    profileParagraph: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4)
    },
    profileCard: {
        paddingTop: theme.spacing(4)
    },
    content: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4)
    },
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
    const { tweets } = politician;

    const lineChartData = politician.sentimentHistory.map((opinionSummary: OpinionSummary) => {
        return {date: new Date(opinionSummary.dateTime), value: opinionSummary.sentiment}
    });

    return (
        <React.Fragment>
            <Bar/>
            <ContentContainer>
                <Grid container
                      className={classes.profile}
                      direction='row'
                      justify='center'>
                    <Grid item sm={4}>
                        <Card className={classes.profileCard}>
                            <Grid item sm={12}>
                                <PoliticianAvatar politician={politician} />
                            </Grid>
                            <Grid item sm={12}>
                                <Typography variant='h5' color='primary' className={classes.profileParagraph}>
                                    {politician.name}
                                </Typography>
                                <Typography variant='subtitle1' color='primary' className={classes.profileParagraph}>
                                    {politician.party}
                                </Typography>
                                <Typography variant='subtitle1' color='primary' className={classes.profileParagraph}>
                                    Popularity: {politician.sentiment.toFixed(1)}
                                </Typography>
                            </Grid>
                            { lineChartData.length > 0 ?
                                (
                                    <Grid item
                                          sm={12}>
                                        <LineChart data={lineChartData} xAxis='Time' yAxis='Popularity'/>
                                    </Grid>
                                ) : null
                            }
                        </Card>
                    </Grid>
                    <Grid item sm={8} className={classes.content}>
                        <Grid container
                              alignItems='flex-start'
                              direction='row'
                              justify='center'>
                            <Grid item sm={12}>
                                {
                                    tweets.map((opinion: Tweet, index) => {
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
