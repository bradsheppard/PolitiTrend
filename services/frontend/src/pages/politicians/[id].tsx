import * as React from 'react';
import { createStyles, Grid, Tab, Tabs, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import { NextPageContext } from 'next';
import { Tweet as TweetWidget } from 'react-twitter-widgets'
import ContentContainer from '../../components/common/ContentContainer';
import PoliticianApi from '../../apis/politician/PoliticianApi';
import Bar from '../../components/bar/Bar';
import PoliticianDto from '../../apis/politician/PoliticianDto';
import TweetApi from '../../apis/tweet/TweetApi';
import TweetDto from '../../apis/tweet/TweetDto';
import OpinionSummaryDto from '../../apis/opinion-summary/OpinionSummaryDto';
import OpinionSummaryApi from '../../apis/opinion-summary/OpinionSummaryApi';
import Card from '../../components/common/Card';
import PoliticianHeader from '../../components/politician/PoliticianHeader';

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
    tabValue: string;
}

const PoliticianPage = (props: IProps) => {
    if(!props.politician)
        return (
            <Typography>Not Found</Typography>
        );

    const [tabValue, setTabValue] = React.useState(0);

    const { politician, classes } = props;
    const { tweets } = politician;

    const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <React.Fragment>
            <Bar/>
            <ContentContainer>
                <Grid container
                      className={classes.profile}
                      direction='row'
                      justify='center'>
                    <Grid item sm={4}>
                        <PoliticianHeader politician={politician}/>
                    </Grid>
                    <Grid item sm={8} className={classes.content}>
                        <Card>
                            <Tabs
                                value={tabValue}
                                indicatorColor='primary'
                                textColor='primary'
                                onChange={handleTabChange}
                                centered
                            >
                                <Tab label='Tweets' />
                                <Tab label='News Articles' />
                            </Tabs>
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
                        </Card>
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
        const tweetsDto: TweetDto[] = await TweetApi.get(context, {politicians: [parseInt(id)], limit: 10});
        const opinionSummaryDtos: OpinionSummaryDto[] = await OpinionSummaryApi.get(context, { politician: parseInt(id) });
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
