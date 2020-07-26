import * as React from 'react';
import NewsArticleApi from '../../apis/news-article/NewsArticleApi';
import NewsArticleDto from '../../apis/news-article/NewsArticleDto';
import NewsArticleComponent from './PoliticianNewsArticle';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
    content: {
        marginBottom: theme.spacing(6),
        marginTop: theme.spacing(2)
    },
});

interface NewsArticle {
    title: string;
    url: string;
    image: string;
    source: string;
    description: string;
    dateTime: string;
}

interface IProps extends WithStyles<typeof styles> {
    politician: number;
}

interface IState {
    newsArticles: NewsArticle[];
}

class PoliticianNewsArticleFeed extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            newsArticles: []
        };
    }

    async componentDidMount() {
        const newsArticleDtos: NewsArticleDto[] = await NewsArticleApi.get({politician: this.props.politician, limit: 10});
        this.setState({
            newsArticles: newsArticleDtos
        });
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.state.newsArticles.map((newsArticle: NewsArticle, index: number) => {
                        return (
                            <div className={this.props.classes.content} key={index}>
                                <NewsArticleComponent newsArticle={newsArticle} />
                            </div>
                        );
                    })
                }
            </React.Fragment>
        )
    }

}

export default withStyles(styles)(PoliticianNewsArticleFeed);
