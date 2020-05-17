import * as React from 'react';
import { Tweet as TweetWidget } from 'react-twitter-widgets'
import TweetDto from '../../apis/tweet/TweetDto';
import TweetApi from '../../apis/tweet/TweetApi';

interface Tweet {
    tweetId: string;
    tweetText: string;
}

interface IProps {
    politician: number;
}

interface IState {
    tweets: Tweet[];
}

class PoliticianTweetFeed extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            tweets: []
        };
    }

    async componentDidMount() {
        const { politician } = this.props;
        const tweetDtos: TweetDto[] = await TweetApi.get({politician, limit: 10});
        const tweets = tweetDtos.map(x => { return {tweetId: x.tweetId} as Tweet });
        this.setState({
            tweets
        });
    }

    render() {

        return (
            <React.Fragment>
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
