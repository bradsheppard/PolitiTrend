import { Box, createStyles, Divider, Theme, Typography } from '@material-ui/core';
import * as React from 'react';
import ContentContainer from '../components/common/ContentContainer';
import { makeStyles } from '@material-ui/core/styles';
import WordCloud from '../components/common/WordCloud';
import WordCloudApi from '../apis/word-cloud/WordCloudApi';
import WordCloudDto from '../apis/word-cloud/WordCloudDto';
import LineChart from '../components/common/LineChart';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            paddingTop: theme.spacing(2)
        },
        line: {
            backgroundColor: 'black',
            height: 3
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
            <Typography gutterBottom variant='h5' color='textPrimary' className={classes.header}>
                <Box fontWeight='fontWeightBold'>
                    Trending
                </Box>
            </Typography>
            <Divider variant='middle' />
            <WordCloud wordCounts={props.wordCounts}/>
            <Typography gutterBottom variant='h5' color='textPrimary' className={classes.header}>
                <Box fontWeight='fontWeightBold'>
                    Popularity
                </Box>
            </Typography>
            <Divider variant='middle' />
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
