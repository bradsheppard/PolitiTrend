import * as React from 'react'
import { ResponsiveLine as NivoLine } from '@nivo/line'
import { scaleSentiment } from '../../utils/sentiment'
import { Box, Grid } from '@material-ui/core'

interface Props {
    democraticHistoricalSentiment: Sentiment[]
    republicanHistoricalSentiment: Sentiment[]
}

interface Sentiment {
    dateTime: string
    sentiment: number
}

interface Point {
    x: string
    y: number
}

interface Line {
    id: string
    data: Point[]
}

const StatsPartySentimentTable: React.FC<Props> = (props: Props) => {
    const sentimentToCoordinate = (sentiment: Sentiment) => {
        const date = new Date(sentiment.dateTime)
        return {
            x: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
            y: scaleSentiment(sentiment.sentiment),
        }
    }

    const democraticData = props.democraticHistoricalSentiment.map((sentiment) =>
        sentimentToCoordinate(sentiment)
    )
    const republicanData = props.republicanHistoricalSentiment.map((sentiment) =>
        sentimentToCoordinate(sentiment)
    )

    const lines: Line[] = [
        {
            id: 'Democratic',
            data: democraticData,
        },
        {
            id: 'Republican',
            data: republicanData,
        },
    ]

    const colors = ['#334eff', '#ff3344']

    return (
        <Grid container>
            <Grid item xs={12}>
                <Box height={400}>
                    <NivoLine
                        data={lines}
                        colors={colors}
                        margin={{ top: 50, right: 150, bottom: 50, left: 60 }}
                        xScale={{
                            type: 'time',
                            format: '%Y-%m-%d',
                            useUTC: false,
                            precision: 'day',
                        }}
                        legends={[
                            {
                                anchor: 'bottom-right',
                                direction: 'column',
                                justify: false,
                                translateX: 180,
                                translateY: 0,
                                itemsSpacing: 0,
                                itemDirection: 'left-to-right',
                                itemWidth: 160,
                                itemHeight: 20,
                                itemOpacity: 0.75,
                                symbolSize: 12,
                                symbolShape: 'circle',
                                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemBackground: 'rgba(0, 0, 0, .03)',
                                            itemOpacity: 1,
                                        },
                                    },
                                ],
                            },
                        ]}
                        xFormat="time:%Y-%m-%d"
                        yScale={{ type: 'linear', min: 1, max: 10, stacked: false, reverse: false }}
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            format: '%b %d',
                            tickValues: 'every 2 days',
                            legend: 'time scale',
                            legendOffset: -12,
                        }}
                        axisLeft={{
                            orient: 'left',
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Sentiment',
                            legendOffset: -40,
                            legendPosition: 'middle',
                        }}
                        pointSize={8}
                        pointColor={{ theme: 'background' }}
                        pointBorderWidth={3}
                        pointBorderColor={{ from: 'serieColor' }}
                        pointLabel="sentiment"
                        pointLabelYOffset={-12}
                        lineWidth={3}
                        useMesh={true}
                    />
                </Box>
            </Grid>
        </Grid>
    )
}

export default StatsPartySentimentTable
