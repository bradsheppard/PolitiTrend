import { Grid, Theme } from '@material-ui/core'
import * as React from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import GlobalWordCloudApi from '../apis/GlobalWordCloudApi'
import PoliticianSentimentApi from '../apis/PoliticianSentimentApi'
import PoliticianApi from '../apis/PoliticianApi'
import StatePartyAffiliationApi from '../apis/StatePartyAffiliationApi'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import PartySentimentApi from '../apis/PartySentimentApi'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            padding: theme.spacing(2),
            backgroundColor: theme.palette.primary.main,
        },
        card: {
            marginTop: theme.spacing(4),
            marginBottom: theme.spacing(4),
        },
        wordCloud: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            minHeight: theme.spacing(50),
        },
        map: {
            maxWidth: '70em',
            margin: '0 auto',
        },
    })
)

interface Props {
    wordCounts: WordCount[]
    politicians: Politician[]
    statePartyAffiliations: StatePartyAffiliation[]
    republicanSentiment: PartySentiment[]
    democraticSentiment: PartySentiment[]
}

interface PartySentiment {
    party: string
    dateTime: string
    sentiment: number
}

interface StatePartyAffiliation {
    state: string
    affiliations: {
        democratic: number
        republican: number
    }
    sampleSize: number
}

interface WordCount {
    word: string
    count: number
}

interface Politician {
    id: number
    name: string
    party: string
    sentiment?: number
}

const trendingHashtagsDescription = 'Trending hashtags per-politician based on social media posts.'
const socialMediaSentimentDescription =
    'Popularity/likeability of the politician based on social media posts. ' +
    'A higher number indicates a higher favorability (on a scale of 1 to 10).'
const stateAffiliationDescription =
    'Democratic/Republican favorability per-state based on social media posts.'

const DynamicWordCloud = dynamic(() => import('../components/stats/StatsWordCloud'))
const DynamicPoliticianSentimentTable = dynamic(
    () => import('../components/stats/StatsPoliticianSentimentTable')
)
const DynamicPartySentimentTable = dynamic(
    () => import('../components/stats/StatsPartySentimentTable')
)
const DynamicStatsMap = dynamic(() => import('../components/stats/StatsMap'))
const DynamicStatsCard = dynamic(() => import('../components/stats/StatsCard'))

const Stats: NextPage<Props> = (props: Props) => {
    const classes = useStyles()

    return (
        <Grid container justify="center">
            <Grid item xs={12} md={10}>
                <DynamicStatsCard
                    title="TRENDING HASHTAGS"
                    description={trendingHashtagsDescription}
                    className={classes.card}
                >
                    <DynamicWordCloud
                        wordCounts={props.wordCounts}
                        politicians={props.politicians}
                    />
                </DynamicStatsCard>
            </Grid>
            <Grid item xs={12} md={10}>
                <DynamicStatsCard
                    title="POLITICIAN SOCIAL MEDIA SENTIMENT"
                    description={socialMediaSentimentDescription}
                    className={classes.card}
                >
                    <DynamicPoliticianSentimentTable politicians={props.politicians} />
                </DynamicStatsCard>
            </Grid>
            <Grid item xs={12} md={10}>
                <DynamicStatsCard
                    title="PARTY SOCIAL MEDIA SENTIMENT"
                    description={socialMediaSentimentDescription}
                    className={classes.card}
                >
                    <DynamicPartySentimentTable
                        republicanHistoricalSentiment={props.republicanSentiment}
                        democraticHistoricalSentiment={props.democraticSentiment}
                    />
                </DynamicStatsCard>
            </Grid>
            <Grid item xs={12} md={10}>
                <DynamicStatsCard
                    title="STATE MATCHUP"
                    description={stateAffiliationDescription}
                    className={classes.card}
                >
                    <DynamicStatsMap
                        className={classes.map}
                        statePartyAffiliations={props.statePartyAffiliations}
                    />
                </DynamicStatsCard>
            </Grid>
        </Grid>
    )
}

Stats.getInitialProps = async function (): Promise<Props> {
    const start = new Date()
    start.setDate(start.getDate() - 15)

    const [
        politicianDtos,
        wordCloudDtos,
        politicianSentimentDtos,
        partySentimentDtos,
        statePartyAffiliationsDtos,
    ] = await Promise.all([
        PoliticianApi.get(),
        GlobalWordCloudApi.get({ limit: 1 }),
        PoliticianSentimentApi.get(),
        PartySentimentApi.get({ start }),
        StatePartyAffiliationApi.get(),
    ])

    const politicianSentiments = politicianDtos.reduce<Politician[]>((result, politician) => {
        const sentiment = politicianSentimentDtos.find((x) => x.politician == politician.id)
        result.push({
            id: politician.id,
            name: politician.name,
            party: politician.party,
            sentiment: sentiment ? sentiment.sentiment : undefined,
        })
        return result
    }, [])

    const republicanSentiment = partySentimentDtos.filter((x) => x.party === 'Republican')
    const democraticSentiment = partySentimentDtos.filter((x) => x.party === 'Democratic')

    return {
        wordCounts: wordCloudDtos.length > 0 ? wordCloudDtos[0].words : [],
        politicians: politicianSentiments,
        statePartyAffiliations: statePartyAffiliationsDtos,
        republicanSentiment,
        democraticSentiment,
    }
}

export default Stats
