import * as React from 'react';
import { Box, Card, createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import PoliticianAvatar from './PoliticianAvatar';
import LineChart from '../common/LineChart';

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

interface OpinionSummary {
    sentiment: number;
    dateTime: string;
}

interface Politician {
    name: string;
    party: string;
    sentiment: number;
    sentimentHistory: OpinionSummary[];
}

interface IProps {
    politician: Politician;
}

const PoliticianHeader = (props: IProps) => {
    const { politician } = props;
    const classes = useStyles();

    const lineChartData = politician.sentimentHistory.map((opinionSummary: OpinionSummary) => {
        return {date: new Date(opinionSummary.dateTime), value: opinionSummary.sentiment}
    });

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
            { lineChartData.length > 0 ?
                (
                    <Grid item
                          sm={12}>
                        <LineChart data={lineChartData} xAxis='Time' yAxis='Popularity'/>
                    </Grid>
                ) : null
            }
        </Card>
    );
};

export default PoliticianHeader;
