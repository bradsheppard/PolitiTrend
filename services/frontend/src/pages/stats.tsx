import { Box, createStyles, Theme, Typography } from '@material-ui/core';
import * as React from 'react';
import ContentContainer from '../components/common/ContentContainer';
import { makeStyles } from '@material-ui/core/styles';
import WordCloud from '../components/common/WordCloud';
import WordCloudApi from '../apis/word-cloud/WordCloudApi';
import WordCloudDto from '../apis/word-cloud/WordCloudDto';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            paddingTop: theme.spacing(2)
        }
    })
);

interface IProps {
    wordCounts: WordCount[];
}

interface WordCount {
    word: string;
    count: number;
}

const Stats = (props: IProps) => {
    const classes = useStyles();

    return (
        <ContentContainer>
            <Typography gutterBottom variant='h3' color='textPrimary' className={classes.header}>
                <Box fontWeight='fontWeightBold'>
                    Most Talked About
                </Box>
            </Typography>
            <WordCloud wordCounts={props.wordCounts}/>
        </ContentContainer>
    );
};

Stats.getInitialProps = async function (): Promise<IProps> {
    const wordClouds: WordCloudDto[] = await WordCloudApi.get({limit: 1});

    if (wordClouds.length > 0)
        return {
            wordCounts: wordClouds[0].words
        };

    return {
        wordCounts: []
    }
};

export default Stats;
