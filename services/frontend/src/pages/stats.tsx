import { createStyles, Grid, Theme } from '@material-ui/core';
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import WordCloud from '../components/common/WordCloud';
import GlobalWordCloudApi from '../apis/global-word-cloud/GlobalWordCloudApi';
import SentimentApi from '../apis/sentiment/SentimentApi';
import PoliticianApi from '../apis/politician/PoliticianApi';
import StatsSentimentTable from '../components/stats/StatsSentimentTable';
import StatsCard from '../components/stats/StatsCard';
import PieChart from '../components/common/PieChart';

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
                    <Grid container>
                        <Grid item xs={6}>
                            <WordCloud wordCounts={props.wordCounts} className={classes.wordCloud} />
                        </Grid>
                        <Grid item xs={6}>
                            <PieChart categories={props.wordCounts.map(x => {return {name: x.word, value: x.count}})} />
                        </Grid>
                    </Grid>
                </StatsCard>
            </Grid>

            <Grid item xs={12}>
                <StatsCard title='Social Media Sentiment' className={classes.card}>
                    <StatsSentimentTable politicians={props.politicians} points={[]} />
                </StatsCard>
            </Grid>
        </Grid>
    );
};

Stats.getInitialProps = async function (): Promise<IProps> {
    const [ politicians, wordClouds, sentiments ] = await Promise.all([
        PoliticianApi.get(),
        GlobalWordCloudApi.get({limit: 1}),
        SentimentApi.get()
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
        politicians: politicianSentiments.sort((a, b) => b.sentiment - a.sentiment)
    };
};

export default Stats;
