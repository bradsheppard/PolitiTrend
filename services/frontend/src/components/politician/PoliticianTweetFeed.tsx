import * as React from 'react'
import { Tweet as TweetWidget } from 'react-twitter-widgets'
import TweetApi from '../../apis/TweetApi'

interface Tweet {
    tweetId: string
    tweetText: string
}

interface Props {
    politician: number
}

interface State {
    tweets: Tweet[]
}

class PoliticianTweetFeed extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            tweets: [],
        }
    }

    async componentDidMount(): Promise<void> {
        const { politician } = this.props
        const tweetDtos: Tweet[] = await TweetApi.get({ politician, limit: 10 })
        const tweets = tweetDtos.map((x) => {
            return { tweetId: x.tweetId } as Tweet
        })
        this.setState({
            tweets,
        })
    }

    render(): React.ReactFragment {
        return (
            <React.Fragment>
                {this.state.tweets.map((tweet: Tweet, index) => {
                    return (
                        <TweetWidget
                            options={{
                                align: 'center',
                            }}
                            tweetId={tweet.tweetId}
                            key={index}
                        />
                    )
                })}
            </React.Fragment>
        )
    }
}

export default PoliticianTweetFeed
