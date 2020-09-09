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
import YoutubeVideoApi from '../apis/video/youtube/YoutubeVideoApi';
import VideoPlayer from '../components/common/VideoPlayer';
import HomeElectionMatchup from '../components/home/HomeElectionMatchup';
import SentimentApi from '../apis/sentiment/SentimentApi';
import PoliticianApi from '../apis/politician/PoliticianApi';

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

interface Politician {
    name: string;
    party: string;
    sentiment: number;
    role: string;
}

const styles = (theme: Theme) => createStyles({
    newsArticle: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(6),
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    electionMatchup: {
        marginTop: theme.spacing(10),
        marginBottom: theme.spacing(10)
    },
    tweet: {
        marginTop: theme.spacing(2)
    }
});

interface IProps extends WithStyles<typeof styles> {
    mainNewsArticles: NewsArticle[];
    latestNewsArticles: NewsArticle[];
    youtubeVideos: YoutubeVideo[];
    incumbent: Politician;
    challenger: Politician;
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
        const [
            newsArticleDtos,
            youtubeVideoDtos,
            incumbentSentimentDto,
            challengerSentimentDto,
            incumbentPolitician,
            challengerPolitician,
        ] = await Promise.all([
            NewsArticleApi.get({limit: 6}),
            YoutubeVideoApi.get({limit: 6}),
            SentimentApi.getForPolitician(101),
            SentimentApi.getForPolitician(102),
            PoliticianApi.getOne(101),
            PoliticianApi.getOne(102)
        ]);

        const incumbent: Politician = {
            name: incumbentPolitician!.name,
            party: incumbentPolitician!.party,
            sentiment: incumbentSentimentDto![0].sentiment,
            role: incumbentPolitician!.role
        }

        const challenger: Politician = {
            name: challengerPolitician!.name,
            party: challengerPolitician!.party,
            sentiment: challengerSentimentDto![0].sentiment,
            role: challengerPolitician!.role
        }

        return {
            mainNewsArticles: newsArticleDtos,
            latestNewsArticles: newsArticleDtos,
            youtubeVideos: youtubeVideoDtos,
            incumbent,
            challenger
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
                        <Grid item xs={12}>
                            <HomeHeader>
                                ELECTION MATCHUP
                            </HomeHeader>
                        </Grid>
                        <Grid item xs={12}>
                            <div className={classes.electionMatchup}>
                                <HomeElectionMatchup incumbent={this.props.incumbent} challenger={this.props.challenger} />
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <HomeHeader>
                                NEWS ARTICLES
                            </HomeHeader>
                        </Grid>
                        <Grid item
                            xs={12}>
                            {
                                this.props.mainNewsArticles.map((newsArticle, index) => {
                                    return (
                                        <div className={classes.newsArticle} key={index}>
                                            <HomeMainNewsArticle newsArticle={newsArticle} height={400} />
                                        </div>
                                    )
                                })
                            }
                        </Grid>
                        <Grid item xs={12}>
                            <HomeHeader>
                                Trending Videos
                            </HomeHeader>
                        </Grid>
                        <Grid item xs={12}>
                            <div className={classes.newsArticle}>
                                <VideoPlayer videos={this.props.youtubeVideos} />
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <HomeHeader>
                                Latest
                            </HomeHeader>
                        </Grid>
                        {
                            this.props.latestNewsArticles.map((newsArticle, index) => {
                                return (
                                    <Grid item xs={12} md={4} key={index}>
                                        <div className={classes.newsArticle}>
                                            <HomeLatestNewsArticle newsArticle={newsArticle} />
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
