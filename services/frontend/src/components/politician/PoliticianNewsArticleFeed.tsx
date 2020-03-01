import * as React from 'react';
import NewsArticleApi from '../../apis/news-article/NewsArticleApi';
import NewsArticleDto from '../../apis/news-article/NewsArticleDto';
import NewsArticleComponent from '../common/NewsArticle';

interface NewsArticle {
    title: string;
    url: string;
    image: string;
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
        const newsArticles = newsArticleDtos.map(x => { return {title: x.title, url: x.url, image: x.image} as NewsArticle });
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
                            <NewsArticleComponent newsArticle={newsArticle} />
                        );
                    })
                }
            </React.Fragment>
        )
    }

}

export default PoliticianNewsArticleFeed;
