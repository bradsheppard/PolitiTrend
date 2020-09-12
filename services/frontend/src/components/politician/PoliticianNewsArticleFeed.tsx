import * as React from 'react';
import NewsArticleApi from '../../apis/news-article/NewsArticleApi';
import NewsArticleDto from '../../apis/news-article/NewsArticleDto';
import NewsArticleComponent from '../common/NewsArticle';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination'

const styles = (theme: Theme) => createStyles({
    content: {
        marginBottom: theme.spacing(6),
        marginTop: theme.spacing(2)
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6)
    }
});

interface NewsArticle {
    url: string;
    source: string;
    dateTime: string;
    summary: string;
    politicians: Politician[];
}

interface Politician {
    name: string;
    party: string;
}

interface IProps extends WithStyles<typeof styles> {
    politician: number;
}

interface IState {
    newsArticles: NewsArticle[];
    politicians: Politician[];
    page: number;
}

class PoliticianNewsArticleFeed extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            newsArticles: [],
            politicians: [],
            page: 1
        };
    }

    async componentDidMount() {
        const newsArticleDtos: NewsArticleDto[] = await NewsArticleApi.get({politician: this.props.politician, limit: 5});

        this.setState({
            newsArticles: newsArticleDtos
        });
    }

    async handleChange(_: React.ChangeEvent<unknown>, value: number) {
        const newsArticleDtos: NewsArticleDto[] = await NewsArticleApi.get(
            {
                politician: this.props.politician,
                limit: 5,
                offset: 5 * (value - 1)
            });

        this.setState({
            page: value,
            newsArticles: newsArticleDtos
        })
    }

    render() {
        return (
            <div>
                <Pagination className={this.props.classes.pagination} count={10} page={this.state.page} onChange={this.handleChange.bind(this)} />
                {
                    this.state.newsArticles.map((newsArticle: NewsArticle, index: number) => {
                        return (
                            <div className={this.props.classes.content} key={index}>
                                <NewsArticleComponent newsArticle={newsArticle} />
                            </div>
                        );
                    })
                }
            </div>
        )
    }
}

export default withStyles(styles)(PoliticianNewsArticleFeed);
