import * as React from 'react';
import { Box, Card, createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import PoliticianAvatar from './PoliticianAvatar';
import WordCloud from '../common/WordCloud';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        profileParagraph: {
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4)
        },
        profileCard: {
            paddingTop: theme.spacing(4),
            background: 'none'
        }
    })
);

interface WordCount {
    word: string;
    count: number;
}

interface Politician {
    name: string;
    party: string;
    sentiment: number;
    wordCounts: WordCount[];
}

interface IProps {
    politician: Politician;
}

const PoliticianHeader = (props: IProps) => {
    const { politician } = props;
    const classes = useStyles();

    return (
        <Card className={classes.profileCard} elevation={0}>
            <Grid item sm={12}>
                <PoliticianAvatar politician={politician} />
            </Grid>
            <Grid item sm={12}>
                <Typography variant='h4' color='primary' className={classes.profileParagraph}>
                    <Box fontWeight='fontWeightBold'>
                        {politician.name}
                    </Box>
                </Typography>
                <Typography variant='h6' color='primary' className={classes.profileParagraph}>
                    <Box fontWeight='fontWeightBold'>
                        {politician.party}
                    </Box>
                </Typography>
                <Typography variant='subtitle1' color='primary' className={classes.profileParagraph}>
                    Popularity: {politician.sentiment.toFixed(1)}
                </Typography>
            </Grid>
            <WordCloud wordCounts={politician.wordCounts}/>
        </Card>
    );
};

export default PoliticianHeader;
