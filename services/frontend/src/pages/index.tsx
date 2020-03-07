import {
    createStyles, Fade, Grid,
    Theme, WithStyles,
    withStyles
} from '@material-ui/core';
import * as React from 'react';
import ContentContainer from '../components/common/ContentContainer';
import Bar from '../components/bar/Bar';
import NewsArticleDto from '../apis/news-article/NewsArticleDto';
import NewsArticleApi from '../apis/news-article/NewsArticleApi';
import HomeNewsArticle from '../components/home/HomeNewsArticle';
import TweetDto from '../apis/tweet/TweetDto';
import TweetApi from '../apis/tweet/TweetApi';
import { Tweet as TweetWidget } from 'react-twitter-widgets'
import TransparentJumbo from '../components/common/TransparentJumbo';
import { Waypoint } from 'react-waypoint';

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
    newsArticles: NewsArticle[];
    tweets: string[];
}

interface IState {
    visibility: boolean[];
}

class App extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            visibility: Array(props.newsArticles.length).fill(false)
        }
    }

    static async getInitialProps() {
        const newsArticleDtos: NewsArticleDto[] = await NewsArticleApi.get({limit: 4, politicians: [95]});
        const tweetDtos: TweetDto[] = await TweetApi.get({limit: 4, politicians: [95]});

        return {
            newsArticles: newsArticleDtos,
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
                <Bar overlay />
                <TransparentJumbo />
                <ContentContainer>
                    <Grid container
                        direction='row'
                        justify='center'>
                        <Grid item
                            xs={12}>
                            {
                                this.props.newsArticles.map((newsArticle, index) => {
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
                        <Grid item
                              xs={3}>
                            {
                                this.props.tweets.map((tweet, index) => {
                                    return (
                                        <div className={classes.tweet}>
                                            <TweetWidget
                                                options={{
                                                    align: 'center'
                                                }}
                                                tweetId={tweet}
                                                key={index}
                                            />
                                        </div>
                                    )
                                })
                            }
                        </Grid>
                    </Grid>
                </ContentContainer>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(App);
