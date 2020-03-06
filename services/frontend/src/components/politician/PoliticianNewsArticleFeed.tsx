import * as React from 'react';
import NewsArticleApi from '../../apis/news-article/NewsArticleApi';
import NewsArticleDto from '../../apis/news-article/NewsArticleDto';
import NewsArticleComponent from './PoliticianNewsArticle';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
    content: {
        paddingLeft: theme.spacing(8),
        paddingRight: theme.spacing(8),
        paddingBottom: theme.spacing(10)
    },
});

interface NewsArticle {
    title: string;
    url: string;
    image: string;
    source: string;
    description: string;
}

interface IProps extends WithStyles<typeof styles> {
    politician: number;
    hidden?: boolean;
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
        const newsArticleDtos: NewsArticleDto[] = await NewsArticleApi.get({politicians: [this.props.politician], limit: 10});
        const newsArticles = newsArticleDtos.map(x => {
            return {
                title: x.title,
                url: x.url,
                image: x.image,
                source: x.source,
                description: x.description
            } as NewsArticle
        });
        this.setState({
            newsArticles
        });
    }

    render() {
        if(this.props.hidden)
            return null;

        return (
            <React.Fragment>
                {
                    this.state.newsArticles.map((newsArticle: NewsArticle) => {
                        return (
                            <div className={this.props.classes.content}>
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
