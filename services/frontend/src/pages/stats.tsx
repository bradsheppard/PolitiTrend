import { Box, createStyles, Theme, Typography } from '@material-ui/core';
import * as React from 'react';
import ContentContainer from '../components/common/ContentContainer';
import { makeStyles } from '@material-ui/core/styles';
import WordCloud from '../components/common/WordCloud';

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
                    Topics
                </Box>
            </Typography>
            <WordCloud wordCounts={props.wordCounts}/>
        </ContentContainer>
    );
};

Stats.getInitialProps = async function () {
    const wordCounts: WordCount[] = [
        {
            word: 'Covid-19',
            count: 100
        },
        {
            word: 'Bernie',
            count: 60
        },
        {
            word: 'Sanders',
            count: 40
        },
        {
            word: 'Trump',
            count: 50
        }
    ];

    return {
        wordCounts
    }
};

export default Stats;
