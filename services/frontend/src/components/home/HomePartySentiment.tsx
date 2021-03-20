import * as React from 'react'
import { Box, createStyles, Grid, Slider, Theme, Typography, withStyles } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { scaleQuantize } from 'd3-scale'
import tinygradient from 'tinygradient'
import Globals from '../../utils/Globals'

interface Props {
    democraticSentiment: number
    republicanSentiment: number
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        image: {
            height: theme.spacing(50),
            margin: theme.spacing(4),
        },
        item: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
    })
)

interface SliderProps {
    color: string
}

const PrettoSliderTemplate = (props: SliderProps) =>
    withStyles({
        root: {
            color: props.color,
            height: 8,
            pointerEvents: 'none',
        },
        markLabel: {
            color: 'grey',
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
    })(Slider)

const sliderMarks = [
    {
        value: -10,
        label: 'Republican (-10)',
    },
    {
        value: 0,
        label: 'Neutral (0)',
    },
    {
        value: 10,
        label: 'Democrat (10)',
    },
]

const gray = '#c4c4c4'

const blueGradient = tinygradient(Globals.blue, gray)
const redGradient = tinygradient(Globals.red, gray)

const republicanScale = scaleQuantize<string>()
    .domain([0, 0.05])
    .range([
        redGradient.rgbAt(0.8).toHexString(),
        redGradient.rgbAt(0.6).toHexString(),
        redGradient.rgbAt(0.4).toHexString(),
        redGradient.rgbAt(0.2).toHexString(),
        redGradient.rgbAt(0).toHexString(),
    ])

const democraticScale = scaleQuantize<string>()
    .domain([0, 0.05])
    .range([
        blueGradient.rgbAt(0.8).toHexString(),
        blueGradient.rgbAt(0.6).toHexString(),
        blueGradient.rgbAt(0.4).toHexString(),
        blueGradient.rgbAt(0.2).toHexString(),
        blueGradient.rgbAt(0).toHexString(),
    ])

const getColor = (sentimentDifference: number) => {
    let color = '#a7a7a7'
    if (sentimentDifference > 0) {
        color = democraticScale(sentimentDifference)
    } else if (sentimentDifference < 0) {
        color = republicanScale(sentimentDifference)
    }

    return color
}

const getSummary = (sentimentDifference: number) => {
    let summary = 'Neutral'

    if (sentimentDifference > 4) {
        summary = 'Large Democrat Favorability'
    } else if (sentimentDifference < -4) {
        summary = 'Large Republican Favorability'
    } else if (sentimentDifference > 0) {
        summary = 'Small Democrat Favorability'
    } else if (sentimentDifference < 0) {
        summary = 'Small Republican Favorability'
    }

    return summary
}

const HomePartySentiment: React.FC<Props> = (props: Props) => {
    const sentimentDifference =
        props.democraticSentiment * 5 + 5 - (props.republicanSentiment * 5 + 5)

    const color = getColor(sentimentDifference)
    const summary = getSummary(sentimentDifference)

    const PrettoSlider = PrettoSliderTemplate({ color })

    const classes = useStyles({ color })

    return (
        <div>
            <Grid container>
                <Grid item xs={12} sm={6} className={classes.item}>
                    <img src="RepublicanLogo.svg" alt="Republican" className={classes.image} />
                    <div>
                        <Typography variant="h4" color="textPrimary" align="center">
                            Republican
                        </Typography>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6} className={classes.item}>
                    <img src="DemocraticLogo.svg" alt="Democrat" className={classes.image} />
                    <div>
                        <Typography variant="h4" color="textPrimary" align="center">
                            Democratic
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
                        defaultValue={sentimentDifference}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle1" color="textSecondary" align="center">
                        <Box fontWeight="fontWeightBold">{summary}</Box>
                    </Typography>
                </Grid>
            </Grid>
        </div>
    )
}

export default HomePartySentiment
