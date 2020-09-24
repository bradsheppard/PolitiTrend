import {
    createStyles, Grid, Theme, WithStyles,
    withStyles
} from '@material-ui/core';
import * as React from 'react';
import ContentContainer from '../components/common/ContentContainer';
import NewsArticleComponent from '../components/common/NewsArticle';
import NewsArticleApi from '../apis/news-article/NewsArticleApi';
import HomeHeader from '../components/home/HomeHeader';
import YoutubeVideoApi from '../apis/video/youtube/YoutubeVideoApi';
import VideoPlayer from '../components/common/VideoPlayer';
import HomeElectionMatchup from '../components/home/HomeElectionMatchup';
import SentimentApi from '../apis/sentiment/SentimentApi';
import PoliticianApi from '../apis/politician/PoliticianApi';
import HomeMainHeader from '../components/home/HomeMainHeader';

interface NewsArticle {
    image: string;
    summary: string;
    url: string;
    source: string;
    dateTime: string;
    politicians: {
        name: string;
        party: string;
    }[];
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
        margin: theme.spacing(4),
        height: `calc(100% - ${theme.spacing(8)}px)`
    },
    electionMatchup: {
        padding: theme.spacing(8),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    tweet: {
        marginTop: theme.spacing(2)
    }
});

interface IProps extends WithStyles<typeof styles> {
    mainNewsArticles: NewsArticle[];
    youtubeVideos: YoutubeVideo[];
    incumbent: Politician;
    challenger: Politician;
}

class App extends React.Component<IProps> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            mainNewsArticleVisibility: Array(props.mainNewsArticles.length).fill(false)
        }
    }

    static async getInitialProps() {
        const incumbentId = 101;
        const challengerId = 102;

        const [
            newsArticleDtos,
            youtubeVideoDtos,
            incumbentSentimentDto,
            challengerSentimentDto,
            politicianDtos
        ] = await Promise.all([
            NewsArticleApi.get({limit: 6}),
            YoutubeVideoApi.get({limit: 6}),
            SentimentApi.getHistoryForPolitician(incumbentId),
            SentimentApi.getHistoryForPolitician(challengerId),
            PoliticianApi.get()
        ]);

        const incumbentPoliticianDto = politicianDtos.find(x => x.id === incumbentId);
        const challengerPoliticianDto = politicianDtos.find(x => x.id === challengerId);

        const incumbent: Politician = {
            name: incumbentPoliticianDto!.name,
            party: incumbentPoliticianDto!.party,
            sentiment: incumbentSentimentDto![0].sentiment,
            role: incumbentPoliticianDto!.role
        }

        const challenger: Politician = {
            name: challengerPoliticianDto!.name,
            party: challengerPoliticianDto!.party,
            sentiment: challengerSentimentDto![0].sentiment,
            role: challengerPoliticianDto!.role
        }

        return {
            mainNewsArticles: newsArticleDtos,
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
                        justify='center'
                        alignItems='stretch'>
                        <Grid item xs={12}>
                            <HomeMainHeader>
                                ELECTION MATCHUP
                            </HomeMainHeader>
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
                            {
                                this.props.mainNewsArticles.map((newsArticle, index) => {
                                    return (
                                        <Grid item xs={12} md={6} key={index}>
                                            <div className={classes.newsArticle}>
                                                <NewsArticleComponent newsArticle={newsArticle} />
                                            </div>
                                        </Grid>
                                    )
                                })
                            }
                        <Grid item xs={12}>
                            <HomeHeader>
                                TRENDING VIDEOS
                            </HomeHeader>
                        </Grid>
                        <Grid item xs={12}>
                            <div className={classes.newsArticle}>
                                <VideoPlayer videos={this.props.youtubeVideos} />
                            </div>
                        </Grid>
                    </Grid>
                </ContentContainer>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(App);
