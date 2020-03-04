import {
    createStyles,
    Grid, GridList,
    GridListTile,
    Theme,
    WithStyles,
    withStyles
} from '@material-ui/core';
import * as React from 'react';
import ContentContainer from '../components/common/ContentContainer';
import Bar from '../components/bar/Bar';
import NewsArticleDto from '../apis/news-article/NewsArticleDto';
import NewsArticleApi from '../apis/news-article/NewsArticleApi';
import NewsArticleComponent from '../components/common/NewsArticle';

interface NewsArticle {
    image: string;
    title: string;
    url: string;
    source: string;
    description: string;
}

const styles = (theme: Theme) => createStyles({
    newsArticle: {
        paddingTop: theme.spacing(2)
    }
});

interface IProps extends WithStyles<typeof styles> {
    newsArticles: NewsArticle[]
}

class App extends React.Component<IProps> {

    static async getInitialProps() {
        const newsArticleDtos: NewsArticleDto[] = await NewsArticleApi.get({limit: 6});

        return {
            newsArticles: newsArticleDtos
        };
    }

    render() {
        //const { classes } = this.props;

        return (
            <React.Fragment>
                <Bar />
                {/*<TransparentJumbo>*/}
                {/*    <Typography variant='h1' align='center' style={{color: 'white'}}>*/}
                {/*        {Globals.name.toUpperCase()}*/}
                {/*    </Typography>*/}
                {/*</TransparentJumbo>*/}
                <ContentContainer>
                    <Grid container
                          direction='row'
                          justify='center'>
                        <Grid item xs={10}>
                            <GridList cellHeight={500} cols={3}>
                                {
                                    this.props.newsArticles.map(newsArticle => {
                                        return (
                                            <GridListTile>
                                                <NewsArticleComponent newsArticle={newsArticle} />
                                            </GridListTile>
                                        );
                                    })
                                }
                            </GridList>
                        </Grid>
                    </Grid>
                </ContentContainer>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(App);
