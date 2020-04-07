import { Box, createStyles, Theme, Typography } from '@material-ui/core';
import * as React from 'react';
import ContentContainer from '../components/common/ContentContainer';
import { makeStyles } from '@material-ui/core/styles';
import WordCloud from '../components/common/WordCloud';
import WordCloudApi from '../apis/word-cloud/WordCloudApi';
import WordCloudDto from '../apis/word-cloud/WordCloudDto';
import LineChart from '../components/common/LineChart';
import Divider from '../components/common/Divider';
import PieChart from '../components/common/PieChart';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            paddingTop: theme.spacing(4),
            textAlign: 'center'
        },
        line: {
            backgroundColor: 'black',
            height: 3
        },
        wordCloud: {
            paddingTop: theme.spacing(10),
            paddingBottom: theme.spacing(10)
        }
    })
);

interface IProps {
    wordCounts: WordCount[];
    politicianPopularities: PoliticianPopularity[];
}

interface WordCount {
    word: string;
    count: number;
}

interface PoliticianPopularity {
    politician: string;
    historicalPopularity: Popularity[];
}

interface Popularity {
    value: number;
    date: Date;
}

const Stats = (props: IProps) => {
    const classes = useStyles();

    return (
        <ContentContainer>
            <div className={classes.header}>
                <Typography gutterBottom variant='h4' color='textPrimary' className={classes.header}>
                    <Box fontWeight='fontWeightBold'>
                        TRENDING
                    </Box>
                </Typography>
                <Divider thickness={3} />
            </div>
            <WordCloud wordCounts={props.wordCounts} className={classes.wordCloud} />
            <PieChart categories={props.wordCounts.map(x => {return {name: x.word, value: x.count}}).slice(0, 10)} />
            <Typography gutterBottom variant='h4' color='textPrimary' className={classes.header}>
                <Box fontWeight='fontWeightBold'>
                    POPULARITY
                </Box>
            </Typography>
            <Divider thickness={3} />
            <LineChart data={props.politicianPopularities[0].historicalPopularity} xAxis='Time' yAxis='Popularity' />
        </ContentContainer>
    );
};

Stats.getInitialProps = async function (): Promise<IProps> {
    const wordClouds: WordCloudDto[] = await WordCloudApi.get({limit: 1});


    if (wordClouds.length > 0)
        return {
            wordCounts: wordClouds[0].words,
            politicianPopularities: [
                {
                    politician: 'Bernie Sanders',
                    historicalPopularity: [
                        {
                            date: new Date(),
                            value: 7
                        }
                    ]
                }
            ]
        };

    return {
        wordCounts: [],
        politicianPopularities: []
    }
};

export default Stats;
