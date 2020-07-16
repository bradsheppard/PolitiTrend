import { createStyles, Grid, Theme } from '@material-ui/core';
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GlobalWordCloudApi from '../apis/global-word-cloud/GlobalWordCloudApi';
import SentimentApi from '../apis/sentiment/SentimentApi';
import PoliticianApi from '../apis/politician/PoliticianApi';
import StatsSentimentTable from '../components/stats/StatsSentimentTable';
import StatsCard from '../components/stats/StatsCard';
import StatsWordCloud from '../components/stats/StatsWordCloud';
import StatePartyAffiliationApi from '../apis/state-party-affiliation/StatePartyAffiliationApi';
import StatsMap from '../components/stats/StatsMap';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            padding: theme.spacing(2),
            backgroundColor: theme.palette.primary.main
        },
        card: {
            margin: theme.spacing(4)
        },
        wordCloud: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            minHeight: theme.spacing(50)
        }
    })
);

interface IProps {
    wordCounts: WordCount[];
    politicians: Politician[];
    statePartyAffiliations: StatePartyAffiliation[];
}

interface StatePartyAffiliation {
    state: string;
    affiliations: {
        democratic: string;
        republican: string;
    }
}

interface WordCount {
    word: string;
    count: number;
}

interface Politician {
    id: number;
    name: string;
    party: string;
    sentiment: number;
}

const Stats = (props: IProps) => {
    const classes = useStyles();

    return (
        <Grid container>
            <Grid item xs={12}>
                <StatsCard title='Trending Hashtags' className={classes.card}>
                    <StatsWordCloud wordCounts={props.wordCounts} politicians={props.politicians} />
                </StatsCard>
            </Grid>

            <Grid item xs={12}>
                <StatsCard title='Social Media Sentiment' className={classes.card}>
                    <StatsSentimentTable politicians={props.politicians} points={[]} />
                </StatsCard>
            </Grid>
            <Grid item xs={12}>
                <StatsCard title='State Affiliations' className={classes.card}>
                    <StatsMap statePartyAffiliations={props.statePartyAffiliations} />
                </StatsCard>
            </Grid>
        </Grid>
    );
};

Stats.getInitialProps = async function (): Promise<IProps> {
    const [ politicians, wordClouds, sentiments, statePartyAffiliations ] = await Promise.all([
        PoliticianApi.get(),
        GlobalWordCloudApi.get({limit: 1}),
        SentimentApi.get(),
        StatePartyAffiliationApi.get()
    ]);

    const politicianSentiments = politicians.map(politician => {
        const sentiment = sentiments.find(x => x.politician == politician.id);
        return {
            id: politician.id,
            name: politician.name,
            party: politician.party,
            sentiment: sentiment ? sentiment.sentiment : 0
        }
    });

    return {
        wordCounts: wordClouds.length > 0 ? wordClouds[0].words : [],
        politicians: politicianSentiments.sort((a, b) => b.sentiment - a.sentiment),
        statePartyAffiliations
    };
};

export default Stats;
