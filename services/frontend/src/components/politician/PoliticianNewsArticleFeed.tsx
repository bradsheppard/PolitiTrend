import * as React from 'react'
import NewsArticleApi from '../../apis/NewsArticleApi'
import { Grid, Theme } from '@material-ui/core'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import Pagination from '@material-ui/lab/Pagination'
import PoliticianNewsArticle from './PoliticianNewsArticle'

const styles = (theme: Theme) =>
    createStyles({
        content: {
            margin: theme.spacing(4),
            height: `calc(100% - ${theme.spacing(8)}px)`,
        },
        pagination: {
            display: 'flex',
            justifyContent: 'center',
        },
    })

interface NewsArticle {
    url: string
    source: string
    dateTime: string
    summary: string
    politicians: Politician[]
}

interface Politician {
    name: string
    party: string
}

interface Props extends WithStyles<typeof styles> {
    politician: number
}

interface State {
    newsArticles: NewsArticle[]
    politicians: Politician[]
    page: number
}

class PoliticianNewsArticleFeed extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            newsArticles: [],
            politicians: [],
            page: 1,
        }
    }

    async componentDidMount() {
        const newsArticleDtos: NewsArticle[] = await NewsArticleApi.get({
            politician: this.props.politician,
            limit: 6,
        })

        this.setState({
            newsArticles: newsArticleDtos,
        })
    }

    async handleChange(_: React.ChangeEvent<unknown>, value: number) {
        const newsArticleDtos: NewsArticle[] = await NewsArticleApi.get({
            politician: this.props.politician,
            limit: 6,
            offset: 6 * (value - 1),
        })

        this.setState({
            page: value,
            newsArticles: newsArticleDtos,
        })
    }

    render() {
        return (
            <div>
                <Pagination
                    className={this.props.classes.pagination}
                    count={10}
                    page={this.state.page}
                    onChange={this.handleChange.bind(this)}
                />
                <Grid container direction="row" justify="center" alignItems="stretch">
                    {this.state.newsArticles.map((newsArticle: NewsArticle, index: number) => {
                        return (
                            <Grid item xs={12} md={6} key={index}>
                                <div className={this.props.classes.content} key={index}>
                                    <PoliticianNewsArticle newsArticle={newsArticle} />
                                </div>
                            </Grid>
                        )
                    })}
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(PoliticianNewsArticleFeed)
