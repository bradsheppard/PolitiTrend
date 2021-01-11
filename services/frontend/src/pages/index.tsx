import { createStyles, Grid, Theme, WithStyles, withStyles } from '@material-ui/core'
import * as React from 'react'
import ContentContainer from '../components/common/ContentContainer'
import NewsArticleComponent from '../components/common/NewsArticle'
import NewsArticleApi from '../apis/news-article/NewsArticleApi'
import Header from '../components/common/Header'
import HomeMainHeader from '../components/home/HomeMainHeader'
import GlobalWordCloudApi from '../apis/global-word-cloud/GlobalWordCloudApi'
import WordCloud from '../components/common/WordCloud'
import StatePartyAffiliationApi from '../apis/state-party-affiliation/StatePartyAffiliationApi'
import StatsMap from '../components/stats/StatsMap'
import StatsSentimentTable from '../components/stats/StatsSentimentTable'
import PoliticianApi from '../apis/politician/PoliticianApi'
import SentimentApi from '../apis/sentiment/SentimentApi'

interface NewsArticle {
    image: string
    summary: string
    url: string
    source: string
    dateTime: string
    politicians: {
        name: string
        party: string
    }[]
}

interface WordCount {
    word: string
    count: number
}

const styles = (theme: Theme) =>
    createStyles({
        newsArticle: {
            margin: theme.spacing(4),
            height: `calc(100% - ${theme.spacing(8)}px)`,
        },
        electionMatchup: {
            padding: theme.spacing(8),
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
        },
        tweet: {
            marginTop: theme.spacing(2),
        },
        video: {
            margin: theme.spacing(4),
        },
        wordCloud: {
            margin: theme.spacing(4),
            minHeight: theme.spacing(50),
        },
        map: {
            maxWidth: '70em',
            margin: '0 auto',
        },
    })

interface StatePartyAffiliation {
    state: string
    affiliations: {
        democratic: number
        republican: number
    }
    sampleSize: number
}

interface Politician {
    id: number
    name: string
    party: string
    sentiment?: number
}

interface IProps extends WithStyles<typeof styles> {
    politicians: Politician[]
    mainNewsArticles: NewsArticle[]
    wordCounts: WordCount[]
    statePartyAffiliations: StatePartyAffiliation[]
}

class App extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            mainNewsArticleVisibility: Array(props.mainNewsArticles.length).fill(false),
        }
    }

    static async getInitialProps() {
        const [
            politiciansDtos,
            newsArticleDtos,
            wordCloudDto,
            statePartyAffiliationDtos,
            sentimentDtos,
        ] = await Promise.all([
            PoliticianApi.get(),
            NewsArticleApi.get({ limit: 6 }),
            GlobalWordCloudApi.get({ limit: 1 }),
            StatePartyAffiliationApi.get(),
            SentimentApi.get(),
        ])

        const politicianSentiments = politiciansDtos.reduce<Politician[]>((result, politician) => {
            const sentiment = sentimentDtos.find((x) => x.politician == politician.id)
            result.push({
                id: politician.id,
                name: politician.name,
                party: politician.party,
                sentiment: sentiment ? sentiment.sentiment : undefined,
            })
            return result
        }, [])

        return {
            politicians: politicianSentiments,
            mainNewsArticles: newsArticleDtos,
            wordCounts: wordCloudDto.length > 0 ? wordCloudDto[0].words : [],
            statePartyAffiliations: statePartyAffiliationDtos,
        }
    }

    render() {
        const { classes } = this.props

        return (
            <React.Fragment>
                <ContentContainer>
                    <Grid container direction="row" justify="center" alignItems="stretch">
                        <Grid item xs={12}>
                            <HomeMainHeader>TRENDING</HomeMainHeader>
                            <WordCloud
                                wordCounts={this.props.wordCounts}
                                className={classes.wordCloud}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Header>NEWS ARTICLES</Header>
                        </Grid>
                        {this.props.mainNewsArticles.map((newsArticle, index) => {
                            return (
                                <Grid item xs={12} md={6} key={index}>
                                    <div className={classes.newsArticle}>
                                        <NewsArticleComponent newsArticle={newsArticle} />
                                    </div>
                                </Grid>
                            )
                        })}
                        <Grid item xs={12}>
                            <Header>SENTIMENT BY STATE</Header>
                            <StatsMap
                                className={classes.map}
                                statePartyAffiliations={this.props.statePartyAffiliations}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Header>SENTIMENT BY POLITICIAN</Header>
                            <StatsSentimentTable politicians={this.props.politicians} />
                        </Grid>
                    </Grid>
                </ContentContainer>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(App)
