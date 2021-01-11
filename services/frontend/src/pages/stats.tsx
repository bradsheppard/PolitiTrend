import { createStyles, Grid, Theme } from '@material-ui/core'
import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import GlobalWordCloudApi from '../apis/global-word-cloud/GlobalWordCloudApi'
import PoliticianSentimentApi from '../apis/politician-sentiment/PoliticianSentimentApi'
import PoliticianApi from '../apis/politician/PoliticianApi'
import StatsSentimentTable from '../components/stats/StatsSentimentTable'
import StatsCard from '../components/stats/StatsCard'
import StatsWordCloud from '../components/stats/StatsWordCloud'
import StatsMap from '../components/stats/StatsMap'
import StatePartyAffiliationApi from '../apis/state-party-affiliation/StatePartyAffiliationApi'
import { NextPage } from 'next'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            padding: theme.spacing(2),
            backgroundColor: theme.palette.primary.main,
        },
        card: {
            margin: theme.spacing(4),
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

interface IProps {
    wordCounts: WordCount[]
    politicians: Politician[]
    statePartyAffiliations: StatePartyAffiliation[]
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

const Stats: NextPage<IProps> = (props: IProps) => {
    const classes = useStyles()

    return (
        <Grid container justify="center">
            <Grid item xs={10}>
                <StatsCard
                    title="TRENDING HASHTAGS"
                    description={trendingHashtagsDescription}
                    className={classes.card}
                >
                    <StatsWordCloud wordCounts={props.wordCounts} politicians={props.politicians} />
                </StatsCard>
            </Grid>
            <Grid item xs={10}>
                <StatsCard
                    title="SOCIAL MEDIA SENTIMENT"
                    description={socialMediaSentimentDescription}
                    className={classes.card}
                >
                    <StatsSentimentTable politicians={props.politicians} />
                </StatsCard>
            </Grid>
            <Grid item xs={10}>
                <StatsCard
                    title="STATE MATCHUP"
                    description={stateAffiliationDescription}
                    className={classes.card}
                >
                    <StatsMap
                        className={classes.map}
                        statePartyAffiliations={props.statePartyAffiliations}
                    />
                </StatsCard>
            </Grid>
        </Grid>
    )
}

Stats.getInitialProps = async function (): Promise<IProps> {
    const [politicians, wordClouds, sentiments, statePartyAffiliations] = await Promise.all([
        PoliticianApi.get(),
        GlobalWordCloudApi.get({ limit: 1 }),
        PoliticianSentimentApi.get(),
        StatePartyAffiliationApi.get(),
    ])

    const politicianSentiments = politicians.reduce<Politician[]>((result, politician) => {
        const sentiment = sentiments.find((x) => x.politician == politician.id)
        result.push({
            id: politician.id,
            name: politician.name,
            party: politician.party,
            sentiment: sentiment ? sentiment.sentiment : undefined,
        })
        return result
    }, [])

    return {
        wordCounts: wordClouds.length > 0 ? wordClouds[0].words : [],
        politicians: politicianSentiments,
        statePartyAffiliations,
    }
}

export default Stats
