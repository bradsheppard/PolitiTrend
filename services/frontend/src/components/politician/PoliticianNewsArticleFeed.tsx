import * as React from 'react';
import NewsArticleApi from '../../apis/news-article/NewsArticleApi';
import NewsArticleDto from '../../apis/news-article/NewsArticleDto';
import NewsArticleComponent from './PoliticianNewsArticle';
import { createStyles, Fade, Theme, WithStyles, withStyles } from '@material-ui/core';
import { Waypoint } from 'react-waypoint';

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
}

interface IProps extends WithStyles<typeof styles> {
    politician: number;
    hidden?: boolean;
}

interface IState {
    newsArticles: NewsArticle[];
    visibility: boolean[];
}

class PoliticianNewsArticleFeed extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            newsArticles: [],
            visibility: []
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
            newsArticles,
            visibility: Array(newsArticles.length).fill(false)
        });
    }

    onEnter(index: number) {
        const state = this.state;
        state.visibility[index] = true;
        this.setState(state);
    }

    onExit(index: number) {
        const state = this.state;
        state.visibility[index] = false;
        this.setState(state);
    }

    render() {
        if(this.props.hidden)
            return null;

        const { visibility } = this.state;

        return (
            <React.Fragment>
                {
                    this.state.newsArticles.map((newsArticle: NewsArticle, index: number) => {
                        return (
                            <Waypoint onEnter={() => this.onEnter(index)} onLeave={() => this.onExit(index)}>
                                <Fade in={visibility[index]} timeout={2000}>
                                    <div className={this.props.classes.content}>
                                        <NewsArticleComponent newsArticle={newsArticle} />
                                    </div>
                                </Fade>
                            </Waypoint>
                        );
                    })
                }
            </React.Fragment>
        )
    }

}

export default withStyles(styles)(PoliticianNewsArticleFeed);