import * as React from 'react';
import { Box, createStyles, Grid, Slider, Theme, Typography, withStyles } from '@material-ui/core';
import { politicianNameToImagePath } from '../../utils/ImagePath';
import { makeStyles } from '@material-ui/styles';
import { scaleQuantize } from 'd3-scale';

interface IProps {
    incumbent: Politician;
    challenger: Politician;
}

interface Politician {
    name: string;
    sentiment: number;
    party: string;
    role: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        image: {
            position: 'absolute',
            margin: 'auto',
            width: '100%',
            top: '-80%',
            bottom: '-100%',
            left: '-100%',
            right: '-100%',
        },
        imageContainer: {
            marginRight: theme.spacing(2),
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '50%',
            height: theme.spacing(50),
            width: theme.spacing(50)
        },
        item: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }
    })
);

const PrettoSliderTemplate = (props: any) => withStyles({
    root: {
        color: props.color,
        height: 8,
        pointerEvents: 'none'
    },
    markLabel: {
        color: 'grey'
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -8,
        marginLeft: -12,
        '&:focus, &:hover, &$active': {
            boxShadow: 'inherit',
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 4px)',
    },
    track: {
        height: 8,
        borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    },
})(Slider);

const sliderMarks = [
    {
        value: -10,
        label: 'Trump (-10)'
    },
    {
        value: 0,
        label: 'Neutral (0)'
    },
    {
        value: 10,
        label: 'Biden (10)'
    }
]

const republicanScale = scaleQuantize<string>()
    .domain([0, 5])
    .range([
        "#cc9b98",
        "#cc7372",
        "#cc5959",
        "#cc4542",
        "#CC2C26"
    ]);

const democraticScale = scaleQuantize<string>()
    .domain([5, 10])
    .range([
        "#99aacd",
        "#8299cd",
        "#6483cd",
        "#4e74cd",
        "#3463cd"
    ]);

const getColor = (sentimentDifference: number) => {
    let color = '#a7a7a7';
    if(sentimentDifference > 0) {
        color = democraticScale(sentimentDifference);
    }
    else if(sentimentDifference < 0) {
        color = republicanScale(sentimentDifference)
    }

    return color;
}

const getSummary = (sentimentDifference: number) => {
    let summary = 'Neutral';

    if(sentimentDifference > 4) {
        summary = 'Large Biden Favorability';
    }
    else if(sentimentDifference < -4) {
        summary = 'Large Trump Favorability';
    }
    else if (sentimentDifference > 0) {
        summary = 'Small Biden Favorability';
    }
    else if (sentimentDifference < 0) {
        summary = 'Small Trump Favorability';
    }

    return summary;
}

const HomeElectionMatchup = (props: IProps) => {
    const sentimentDifference = (props.challenger.sentiment * 5 + 5) - (props.incumbent.sentiment * 5 + 5);

    const color = getColor(sentimentDifference);
    const summary = getSummary(sentimentDifference);

    const PrettoSlider = PrettoSliderTemplate({color})

    const classes = useStyles({color});

    return (
        <div>
            <Grid container>
                <Grid item xs={12} sm={6} className={classes.item}>
                    <div className={classes.imageContainer}>
                        <img src={politicianNameToImagePath(props.incumbent.name)} alt={props.incumbent.name} className={classes.image} />
                    </div>
                    <div>
                        <Typography variant='h4' color='textPrimary' align='center'>
                            <Box fontWeight='fontWeightBold'>
                                {props.incumbent.name}
                            </Box>
                        </Typography>
                        <Typography variant='h6' color='textSecondary' align='center'>
                            {props.incumbent.party}
                        </Typography>
                        <Typography variant='subtitle1' color='textSecondary' align='center'>
                            {props.incumbent.role}
                        </Typography>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6} className={classes.item}>
                    <div className={classes.imageContainer}>
                        <img src={politicianNameToImagePath(props.challenger.name)} alt={props.challenger.name} className={classes.image} />
                    </div>
                    <div>
                        <Typography variant='h4' color='textPrimary' align='center'>
                            <Box fontWeight='fontWeightBold'>
                                {props.challenger.name}
                            </Box>
                        </Typography>
                        <Typography variant='h6' color='textSecondary' align='center'>
                            {props.challenger.party}
                        </Typography>
                        <Typography variant='subtitle1' color='textSecondary' align='center'>
                            {props.challenger.role}
                        </Typography>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <PrettoSlider
                        min={-10}
                        max={10}
                        getAriaValueText={() => sentimentDifference.toFixed(2).toString()}
                        valueLabelFormat={() => sentimentDifference.toFixed(2).toString()}
                        marks={sliderMarks}
                        aria-label="pretto slider"
                        valueLabelDisplay="on"
                        defaultValue={sentimentDifference} />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant='subtitle1' color='textSecondary' align='center'>
                        <Box fontWeight='fontWeightBold'>
                            {summary}
                        </Box>
                    </Typography>
                </Grid>
            </Grid>
        </div>
    );
}

export default HomeElectionMatchup;
