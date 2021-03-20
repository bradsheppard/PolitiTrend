import { createStyles, Grid, Theme, WithStyles, withStyles } from '@material-ui/core'
import * as React from 'react'
import ContentContainer from '../components/common/ContentContainer'
import NewsArticleComponent from '../components/home/HomeNewsArticle'
import NewsArticleApi from '../apis/NewsArticleApi'
import Header from '../components/common/Header'
import GlobalWordCloudApi from '../apis/GlobalWordCloudApi'
import WordCloud from '../components/common/WordCloud'
import StatePartyAffiliationApi from '../apis/StatePartyAffiliationApi'
import StatsMap from '../components/stats/StatsMap'
import StatsSentimentTable from '../components/stats/StatsSentimentTable'
import PoliticianApi from '../apis/PoliticianApi'
import PoliticianSentimentApi from '../apis/PoliticianSentimentApi'
import HomePartySentiment from '../components/home/HomePartySentiment'
import PartySentimentApi from '../apis/PartySentimentApi'
import StatePartyAffiliation from '../apis/model/StatePartyAffiliation'

interface NewsArticle {
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

interface Politician {
    id: number
    name: string
    party: string
    sentiment?: number
}

interface Props extends WithStyles<typeof styles> {
    politicians: Politician[]
    republicanSentiment: number
    democraticSentiment: number
    mainNewsArticles: NewsArticle[]
    wordCounts: WordCount[]
    statePartyAffiliations: StatePartyAffiliation[]
}

class App extends React.Component<Props> {
    constructor(props: Props) {
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
            politicianSentimentDtos,
            partySentimentDtos,
        ] = await Promise.all([
            PoliticianApi.get(),
            NewsArticleApi.get({ limit: 6 }),
            GlobalWordCloudApi.get({ limit: 1 }),
            StatePartyAffiliationApi.get(),
            PoliticianSentimentApi.get(),
            PartySentimentApi.get(),
        ])

        const politicianSentiments = politiciansDtos.reduce<Politician[]>((result, politician) => {
            const sentiment = politicianSentimentDtos.find((x) => x.politician == politician.id)
            result.push({
                id: politician.id,
                name: politician.name,
                party: politician.party,
                sentiment: sentiment ? sentiment.sentiment : undefined,
            })
            return result
        }, [])

        const democraticSentiment = partySentimentDtos.find((x) => x.party === 'Democratic')
        const republicanSentiment = partySentimentDtos.find((x) => x.party === 'Republican')

        return {
            politicians: politicianSentiments,
            mainNewsArticles: newsArticleDtos,
            wordCounts: wordCloudDto.length > 0 ? wordCloudDto[0].words : [],
            statePartyAffiliations: statePartyAffiliationDtos,
            democraticSentiment: democraticSentiment ? democraticSentiment.sentiment : 0,
            republicanSentiment: republicanSentiment ? republicanSentiment.sentiment : 0,
        }
    }

    render() {
        const { classes } = this.props

        return (
            <React.Fragment>
                <ContentContainer>
                    <Grid container direction="row" justify="center" alignItems="stretch">
                        <Grid item xs={12}>
                            <HomePartySentiment
                                democraticSentiment={this.props.democraticSentiment}
                                republicanSentiment={this.props.republicanSentiment}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Header>TRENDING</Header>
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
