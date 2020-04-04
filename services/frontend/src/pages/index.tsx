import {
    createStyles, Grid,
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
import HomeSubNewsArticle from '../components/home/HomeSubNewsArticle';
import HomeHeader from '../components/home/HomeHeader';
import Divider from '../components/common/Divider';
import Fade from '../components/common/Fade';

interface NewsArticle {
    image: string;
    title: string;
    url: string;
    source: string;
    description: string;
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
    subNewsArticles: NewsArticle[];
    tweets: string[];
}

class App extends React.Component<IProps> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            mainNewsArticleVisibility: Array(props.mainNewsArticles.length).fill(false),
            subNewsArticleVisibility: Array(props.subNewsArticles.length).fill(false)
        }
    }

    static async getInitialProps() {
        const newsArticleDtos: NewsArticleDto[] = await NewsArticleApi.get({limit: 8, politician: 90});
        const tweetDtos: TweetDto[] = await TweetApi.get({limit: 4, politician: 90});

        return {
            mainNewsArticles: newsArticleDtos.slice(0, 2),
            subNewsArticles: newsArticleDtos.slice(2, 8),
            tweets: tweetDtos.map(tweetDto => tweetDto.tweetId)
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
                                        <Fade>
                                            <div className={classes.newsArticle} key={index}>
                                                <HomeNewsArticle newsArticle={newsArticle} height={400} />
                                            </div>
                                        </Fade>
                                    )
                                })
                            }
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
                            this.props.subNewsArticles.map((newsArticle, index) => {
                                return (
                                    <Grid item xs={4} key={index}>
                                        <Fade>
                                            <div className={classes.newsArticle}>
                                                <HomeSubNewsArticle newsArticle={newsArticle} />
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
