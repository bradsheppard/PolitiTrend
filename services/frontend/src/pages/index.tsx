import { Grid } from '@material-ui/core';
import * as React from 'react';
import PoliticianApi from '../apis/politician/PoliticianApi';
import { NextPageContext } from 'next';
import CategoryHeader from '../components/CategoryHeader';
import PoliticianSentimentSummary from '../components/PoliticianSentimentSummary';
import ContentContainer from '../components/ContentContainer';
import Bar from '../components/Bar';
import PoliticianDto from '../apis/politician/PoliticianDto';
import TweetApi from '../apis/tweet/TweetApi';
import TweetDto from '../apis/tweet/TweetDto';
import OpinionSummaryDto from '../apis/opinion-summary/OpinionSummaryDto';
import OpinionSummaryApi from '../apis/opinion-summary/OpinionSummaryApi';
import TransparentJumbo from '../components/TransparentJumbo';
import Typography from '@material-ui/core/Typography';
import Globals from '../utils/Globals';

interface IProps {
    topPoliticians: Politician[];
    bottomPoliticians: Politician[];
}

interface Tweet {
    tweetId: string;
    tweetText: string;
}

interface Politician {
    id: number;
    name: string;
    party: string;
    sentiment: number;
    tweets: Tweet[];
}

class App extends React.Component<IProps> {

    static async getInitialProps(context: NextPageContext) {
        let politicianDtos: PoliticianDto[] = await PoliticianApi.get(context);
        //let politicianIds = politicianDtos.map(x => x.id);
        let tweetDtos: TweetDto[] = await TweetApi.get(context);
        let opinionSummaryDtos: OpinionSummaryDto[] = await OpinionSummaryApi.get(context);

        let politicians: Politician[] = [];

        politicianDtos.forEach((politicianDto: PoliticianDto) => {
            const politician = {
                id: politicianDto.id,
                party: politicianDto.party,
                name: politicianDto.name
            } as Politician;

            const summary: OpinionSummaryDto | undefined = opinionSummaryDtos.find(x => x.politician === politicianDto.id);
            politician.tweets = tweetDtos.filter(x => x.sentiments.filter(y => y.politician == politicianDto.id).length > 0);

            if (!summary)
                return;

            politician.sentiment = summary.sentiment;
            politicians.push(politician);
        });

        politicians = politicians.sort((a, b) => b.sentiment - a.sentiment);

        return {
            topPoliticians: politicians.slice(0, 5),
            bottomPoliticians: politicians.slice(politicians.length - 5, politicians.length)
        };
    }

    public render() {
        return (
            <React.Fragment>
                <Bar overlay={true}/>
                <TransparentJumbo>
                    <Typography variant='h1' align='center' style={{color: 'white'}}>
                        {Globals.name.toUpperCase()}
                    </Typography>
                    <Typography variant='h5' align='center' style={{color: 'white'}}>
                        Sentiment analysis of politicians
                    </Typography>
                </TransparentJumbo>
                <ContentContainer>
                    <Grid container
                          direction='row'
                          justify='center'>
                        <Grid item sm={6}>
                            <CategoryHeader>
                                Most Liked
                            </CategoryHeader>
                            {
                                this.props.topPoliticians.map((politician: Politician, index) => {
                                    return (
                                        <PoliticianSentimentSummary politician={politician} key={index}/>
                                    )
                                })
                            }
                        </Grid>
                        <Grid item sm={6}>
                            <CategoryHeader>
                                Most Hated
                            </CategoryHeader>
                            {
                                this.props.bottomPoliticians.map((politician: Politician, index) => {
                                    return (
                                        <PoliticianSentimentSummary politician={politician} key={index}/>
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

export default App;
