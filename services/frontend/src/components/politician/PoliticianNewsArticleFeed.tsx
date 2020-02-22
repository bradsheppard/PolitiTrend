import * as React from 'react';
import NewsArticleApi from '../../apis/news-article/NewsArticleApi';
import NewsArticleDto from '../../apis/news-article/NewsArticleDto';
// import Card from '../common/Card';
import { Typography } from '@material-ui/core';
import Card from '../common/Card';

interface NewsArticle {
    title: string;
    url: string;
}

interface IProps {
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
        const newsArticles = newsArticleDtos.map(x => { return {title: x.title, url: x.url} as NewsArticle });
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
                            <Card>
                                <Typography variant='h5' align='center'>{newsArticle.title}</Typography>
                            </Card>
                        );
                    })
                }
            </React.Fragment>
        )
    }

}

export default PoliticianNewsArticleFeed;
