import { Box, createStyles, Theme, Typography } from '@material-ui/core';
import * as React from 'react';
import ContentContainer from '../components/common/ContentContainer';
import { makeStyles } from '@material-ui/core/styles';
import WordCloud from '../components/common/WordCloud';
import GlobalWordCloudApi from '../apis/global-word-cloud/GlobalWordCloudApi';
import Divider from '../components/common/Divider';
import PieChart from '../components/common/PieChart';
import SentimentApi from '../apis/sentiment/SentimentApi';
import PoliticianApi from '../apis/politician/PoliticianApi';
import StatsSentimentTable from '../components/stats/StatsSentimentTable';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            paddingTop: theme.spacing(4)
        },
        line: {
            backgroundColor: 'black',
            height: 3
        },
        wordCloud: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            minHeight: theme.spacing(50)
        },
        sentiment: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6)
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
    name: string;
    party: string;
    sentiment: number;
}

const Stats = (props: IProps) => {
    const classes = useStyles();

    return (
        <ContentContainer>
            <div className={classes.header}>
                <Typography gutterBottom variant='h5' color='textPrimary' className={classes.header}>
                    <Box fontWeight='fontWeightBold'>
                        Trending Hashtags
                    </Box>
                </Typography>
                <Divider thickness={2} />
            </div>
            <WordCloud wordCounts={props.wordCounts} className={classes.wordCloud} />
            <PieChart categories={props.wordCounts.map(x => {return {name: x.word, value: x.count}})} />
            <Typography gutterBottom variant='h5' color='textPrimary' className={classes.header}>
                <Box fontWeight='fontWeightBold'>
                    Social Media Sentiment
                </Box>
            </Typography>
            <Divider thickness={2} />
            <StatsSentimentTable politicians={props.politicians} className={classes.sentiment} />
        </ContentContainer>
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
