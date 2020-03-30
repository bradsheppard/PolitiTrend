import * as React from 'react';
import { Tweet as TweetWidget } from 'react-twitter-widgets'
import TweetDto from '../../apis/tweet/TweetDto';
import TweetApi from '../../apis/tweet/TweetApi';
import WordCloudDto from '../../apis/word-cloud/WordCloudDto';
import WordCloudApi from '../../apis/word-cloud/WordCloudApi';
import WordCloud from '../common/WordCloud';

interface Tweet {
    tweetId: string;
    tweetText: string;
}

interface IProps {
    politician: number;
    hidden?: boolean;
}

interface WordCount {
    word: string;
    count: number;
}

interface IState {
    wordCounts: WordCount[];
    tweets: Tweet[];
}

class PoliticianTweetFeed extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            tweets: [],
            wordCounts: []
        };
    }

    async componentDidMount() {
        const { politician } = this.props;
        const tweetDtos: TweetDto[] = await TweetApi.get({politicians: [politician], limit: 10});
        const wordCloudDtos: WordCloudDto[] = await WordCloudApi.get({politician, limit: 1});
        const tweets = tweetDtos.map(x => { return {tweetId: x.tweetId} as Tweet });
        this.setState({
            tweets,
            wordCounts: wordCloudDtos[0].words
        });
    }

    render() {

        if (this.props.hidden)
            return null;

        return (
            <React.Fragment>
                <WordCloud wordCounts={this.state.wordCounts} />
                {
                    this.state.tweets.map((tweet: Tweet, index) => {
                        return (
                            <TweetWidget
                                options={{
                                    align: 'center'
                                }}
                                tweetId={tweet.tweetId}
                                key={index}
                            />
                        )
                    })
                }
            </React.Fragment>
        );
    }
}

export default PoliticianTweetFeed;
