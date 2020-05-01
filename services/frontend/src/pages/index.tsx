import {
    createStyles, Grid,
    Theme, WithStyles,
    withStyles
} from '@material-ui/core';
import * as React from 'react';
import ContentContainer from '../components/common/ContentContainer';
import NewsArticleApi from '../apis/news-article/NewsArticleApi';
import HomeMainNewsArticle from '../components/home/HomeMainNewsArticle';
import HomeLatestNewsArticle from '../components/home/HomeLatestNewsArticle';
import HomeHeader from '../components/home/HomeHeader';
import Divider from '../components/common/Divider';
import Fade from '../components/common/Fade';
import HomeTrendingNewsArticle from '../components/home/HomeTrendingNewsArticle';
import YoutubeVideoApi from '../apis/video/youtube/YoutubeVideoApi';
import HomeVideoPlayer from '../components/home/HomeVideoPlayer';

interface NewsArticle {
    image: string;
    title: string;
    url: string;
    source: string;
    description: string;
    dateTime: string;
}

interface YoutubeVideo {
    title: string
    videoId: string;
    thumbnail: string;
}

const styles = (theme: Theme) => createStyles({
    newsArticle: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(6),
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    tweet: {
        marginTop: theme.spacing(2)
    }
});

interface IProps extends WithStyles<typeof styles> {
    mainNewsArticles: NewsArticle[];
    latestNewsArticles: NewsArticle[];
    trendingNewsArticles: NewsArticle[];
    youtubeVideos: YoutubeVideo[];
    tweets: string[];
}

class App extends React.Component<IProps> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            mainNewsArticleVisibility: Array(props.mainNewsArticles.length).fill(false),
            subNewsArticleVisibility: Array(props.latestNewsArticles.length).fill(false)
        }
    }

    static async getInitialProps() {
        const [mainNewsArticleDtos,
            latestNewsArticleDtos,
            trendingNewsArticleDtos,
            youtubeVideoDtos,
        ] = await Promise.all([
            NewsArticleApi.get({limit: 2, politician: 90}),
            NewsArticleApi.get({limit: 6}),
            NewsArticleApi.get({limit: 3}),
            YoutubeVideoApi.get({limit: 6})
        ]);

        return {
            mainNewsArticles: mainNewsArticleDtos,
            latestNewsArticles: latestNewsArticleDtos,
            trendingNewsArticles: trendingNewsArticleDtos,
            youtubeVideos: youtubeVideoDtos
        };
    }

    render() {
        const { classes } = this.props;

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
                                        <Fade key={index}>
                                            <div className={classes.newsArticle}>
                                                <HomeMainNewsArticle newsArticle={newsArticle} height={400} />
                                            </div>
                                        </Fade>
                                    )
                                })
                            }
                        </Grid>
                        <Grid item xs={12}>
                            <Fade>
                                <HomeHeader>
                                    Trending Videos
                                </HomeHeader>
                                <Divider />
                            </Fade>
                        </Grid>
                        <Grid item xs={12}>
                            <div className={classes.newsArticle}>
                                <HomeVideoPlayer videos={this.props.youtubeVideos} />
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <Fade>
                                <HomeHeader>
                                    Latest
                                </HomeHeader>
                                <Divider />
                            </Fade>
                        </Grid>
                        {
                            this.props.latestNewsArticles.map((newsArticle, index) => {
                                return (
                                    <Grid item xs={12} md={4} key={index}>
                                        <Fade>
                                            <div className={classes.newsArticle}>
                                                <HomeLatestNewsArticle newsArticle={newsArticle} />
                                            </div>
                                        </Fade>
                                    </Grid>
                                );
                            })
                        }
                        <Grid item xs={12}>
                            <Fade>
                                <HomeHeader>
                                    Trending
                                </HomeHeader>
                                <Divider />
                            </Fade>
                        </Grid>
                        {
                            this.props.trendingNewsArticles.map((newsArticle, index) => {
                                return (
                                    <Grid item xs={12} key={index}>
                                        <Fade>
                                            <div className={classes.newsArticle}>
                                                <HomeTrendingNewsArticle newsArticle={newsArticle} />
                                            </div>
                                        </Fade>
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
