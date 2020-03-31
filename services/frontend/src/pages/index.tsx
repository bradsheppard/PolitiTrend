import {
    createStyles, Fade, Grid,
    Theme, WithStyles,
    withStyles
} from '@material-ui/core';
import * as React from 'react';
import ContentContainer from '../components/common/ContentContainer';
import NewsArticleDto from '../apis/news-article/NewsArticleDto';
import NewsArticleApi from '../apis/news-article/NewsArticleApi';
import HomeNewsArticle from '../components/home/HomeNewsArticle';
import TweetDto from '../apis/tweet/TweetDto';
import TweetApi from '../apis/tweet/TweetApi';
import { Waypoint } from 'react-waypoint';
import HomeSubNewsArticle from '../components/home/HomeSubNewsArticle';

interface NewsArticle {
    image: string;
    title: string;
    url: string;
    source: string;
    description: string;
}

const styles = (theme: Theme) => createStyles({
    newsArticle: {
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(6)
    },
    tweet: {
        marginTop: theme.spacing(2)
    }
});

interface IProps extends WithStyles<typeof styles> {
    mainNewsArticles: NewsArticle[];
    subNewsArticles: NewsArticle[];
    tweets: string[];
}

interface IState {
    visibility: boolean[];
}

class App extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            visibility: Array(props.mainNewsArticles.length).fill(false)
        }
    }

    static async getInitialProps() {
        const newsArticleDtos: NewsArticleDto[] = await NewsArticleApi.get({limit: 8, politicians: [90]});
        const tweetDtos: TweetDto[] = await TweetApi.get({limit: 4, politicians: [90]});

        return {
            mainNewsArticles: newsArticleDtos.slice(0, 2),
            subNewsArticles: newsArticleDtos.slice(2, 8),
            tweets: tweetDtos.map(tweetDto => tweetDto.tweetId)
        };
    }

    onEnter(index: number) {
        const state = this.state;
        this.state.visibility[index] = true;
        this.setState(state);
    }

    onExit(index: number) {
        const state = this.state;
        state.visibility[index] = false;
        this.setState(state);
    }

    render() {
        const { classes } = this.props;
        const { visibility } = this.state;

        return (
            <React.Fragment>
                <ContentContainer>
                    <Grid container
                        direction='row'
                        justify='center'>
                        <Grid item
                            xs={12}>
                            {
                                this.props.mainNewsArticles.map((newsArticle, index) => {
                                    return (
                                        <Waypoint onEnter={() => this.onEnter(index)} onLeave={() => this.onExit(index)}>
                                            <Fade in={visibility[index]} timeout={2000}>
                                                <div className={classes.newsArticle}>
                                                    <HomeNewsArticle newsArticle={newsArticle} height={400} />
                                                </div>
                                            </Fade>
                                        </Waypoint>
                                    )
                                })
                            }
                        </Grid>
                        {
                            this.props.subNewsArticles.map((newsArticle, index) => {
                                return (
                                    <Grid item xs={4} key={index}>
                                        <div className={classes.newsArticle}>
                                            <HomeSubNewsArticle newsArticle={newsArticle} />
                                        </div>
                                    </Grid>
                                );
                            })
                        }
                    </Grid>
                </ContentContainer>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(App);
