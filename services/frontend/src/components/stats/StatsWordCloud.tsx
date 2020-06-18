import * as React from 'react';
import { createStyles, FormControl, Grid, InputLabel, MenuItem, Select, Theme } from '@material-ui/core';
import WordCloud from '../common/WordCloud';
import PieChart from '../common/PieChart';
import { makeStyles } from '@material-ui/styles';
import { useState } from 'react';
import PoliticianWordCloudApi from '../../apis/politician-word-cloud/PoliticianWordCloudApi';

interface IProps {
    wordCounts: WordCount[];
    politicians: Politician[];
}

interface Politician {
    id: number;
    name: string;
}

interface WordCount {
    word: string;
    count: number;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        wordCloud: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            minHeight: theme.spacing(50)
        },
        formControl: {
            width: '100%',
            marginTop: theme.spacing(4),
            marginBottom: theme.spacing(4)
        }
    })
);

const StatsWordCloud = (props: IProps) => {
    const classes = useStyles();
    const [politician, setPolitician] = useState(-1);
    const [wordCounts, setWordCounts] = useState(props.wordCounts);

    const handleChange = async (event: React.ChangeEvent<{value: unknown}>) => {
        const politicianId = event.target.value as number;
        setPolitician(politicianId);
        const wordCloud = (await PoliticianWordCloudApi.get({politician: politicianId}))[0].words;
        setWordCounts(wordCloud);
    };

    return (
        <Grid container alignItems='center' justify='center'>
            <Grid item xs={6}>
                <WordCloud wordCounts={wordCounts} className={classes.wordCloud} />
            </Grid>
            <Grid item xs={6}>
                <PieChart categories={wordCounts.map(x => {return {name: x.word, value: x.count}})} />
            </Grid>
            <Grid item xs={6}>
                <FormControl className={classes.formControl}>
                    <InputLabel id='politician-label'>Politician</InputLabel>
                    <Select
                        variant='outlined'
                        labelId='politician-label'
                        value={politician}
                        onChange={handleChange}
                    >
                        <MenuItem value={-1}>All</MenuItem>
                        {props.politicians.map(politician => (
                            <MenuItem value={politician.id}>
                                {politician.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
};

export default StatsWordCloud