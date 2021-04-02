import * as React from 'react'
import { Box } from '@material-ui/core'
import { ResponsiveLine as NivoLine } from '@nivo/line'
import PoliticianNewsArticleFeed from './PoliticianNewsArticleFeed'
import PoliticianHeader from './PoliticianHeader'
import PieChart from '../common/PieChart'

interface Props {
    politician: Politician
    wordCounts: WordCount[]
    sentiments: Sentiment[]
}

interface Politician {
    id: number
    name: string
}

interface WordCount {
    word: string
    count: number
}

interface Sentiment {
    politician: number
    dateTime: string
    sentiment: number
}

interface Line {
    id: string
    data: Point[]
}

interface Point {
    x: string
    y: number
}

const PoliticianFeed: React.FC<Props> = (props: Props) => {
    const scaleSentiment = (sentiment: number) => {
        return parseFloat((sentiment * 5 + 5).toFixed(1))
    }

    const data = props.sentiments.map((sentiment) => {
        const date = new Date(sentiment.dateTime)
        return {
            x: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
            y: scaleSentiment(sentiment.sentiment),
        }
    })
    const line: Line = {
        id: props.politician.name,
        data: data,
    }

    return (
        <React.Fragment>
            <PoliticianHeader>TRENDING</PoliticianHeader>
            <Box mt={6} mb={6}>
                <PieChart
                    categories={props.wordCounts.map((x) => {
                        return { name: x.word, value: x.count }
                    })}
                />
            </Box>
            <PoliticianHeader>SENTIMENT</PoliticianHeader>
            <Box height={400}>
                <NivoLine
                    data={[line]}
                    margin={{ top: 50, right: 200, bottom: 50, left: 60 }}
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
                    colors={{ scheme: 'dark2' }}
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
            <PoliticianHeader>NEWS ARTICLES</PoliticianHeader>
            <Box mt={6} mb={6}>
                <PoliticianNewsArticleFeed politician={props.politician.id} />
            </Box>
        </React.Fragment>
    )
}

export default PoliticianFeed
