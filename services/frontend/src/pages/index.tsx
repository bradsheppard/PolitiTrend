import {
    createStyles, Grid,
    Theme, Typography, WithStyles,
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
import Globals from '../utils/Globals';

interface NewsArticle {
    image: string;
    title: string;
    url: string;
    source: string;
    description: string;
}

const styles = (theme: Theme) => createStyles({
    newsArticle: {
        paddingLeft: theme.spacing(2),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2)
    },
    tweet: {
        paddingTop: theme.spacing(2)
    }
});

interface IProps extends WithStyles<typeof styles> {
    newsArticles: NewsArticle[];
    tweets: string[];
}

class App extends React.Component<IProps> {

    static async getInitialProps() {
        const newsArticleDtos: NewsArticleDto[] = await NewsArticleApi.get({limit: 4, politicians: [95]});
        const tweetDtos: TweetDto[] = await TweetApi.get({limit: 4, politicians: [95]});

        return {
            newsArticles: newsArticleDtos,
            tweets: tweetDtos.map(tweetDto => tweetDto.tweetId)
        };
    }

    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Bar />
                <TransparentJumbo>
                    <Typography variant='h1' align='center' style={{color: 'white'}}>
                        {Globals.name.toUpperCase()}
                    </Typography>
                </TransparentJumbo>
                <ContentContainer>
                    <Grid container
                        direction='row'
                        justify='center'>
                        <Grid item
                            xs={12}>
                            {
                                this.props.newsArticles.map(newsArticle => {
                                    return (
                                        <div className={classes.newsArticle}>
                                            <HomeNewsArticle newsArticle={newsArticle} height={400} />
                                        </div>
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
