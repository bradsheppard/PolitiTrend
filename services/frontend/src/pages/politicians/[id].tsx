import * as React from 'react';
import { Typography } from '@material-ui/core';
import PoliticianDetails from '../../components/PoliticianDetails';
import { NextPageContext } from 'next';
import ContentContainer from '../../components/ContentContainer';
import PoliticianApi from '../../apis/politician/PoliticianApi';
import Bar from '../../components/Bar';
import PoliticianDto from '../../apis/politician/PoliticianDto';
import TweetApi from '../../apis/tweet/TweetApi';
import TweetDto from '../../apis/tweet/TweetDto';
import OpinionSummaryDto from '../../apis/opinion-summary/OpinionSummaryDto';
import OpinionSummaryApi from '../../apis/opinion-summary/OpinionSummaryApi';

interface Tweet {
    tweetId: string;
    tweetText: string;
}

interface OpinionSummary {
    sentiment: number;
    dateTime: string;
}

interface Politician {
    name: string;
    party: string;
    sentiment: number;
    tweets: Tweet[];
    sentimentHistory: OpinionSummary[];
}

interface IProps {
    politician: Politician | null;
}

const PoliticianPage = (props: IProps) => {
    if(!props.politician)
        return (
            <Typography>Not Found</Typography>
        );

    return (
        <React.Fragment>
            <Bar/>
            <ContentContainer>
                <PoliticianDetails politician={props.politician} />
            </ContentContainer>
        </React.Fragment>
    )
};

PoliticianPage.getInitialProps = async function(context: NextPageContext): Promise<IProps> {
    const { id } = context.query;
    if (typeof id === 'string') {
        const politicianDto: PoliticianDto | null = await PoliticianApi.getOne(context, parseInt(id));
        const tweetsDto: TweetDto[] = await TweetApi.getForPolitician(context, parseInt(id), 10);
        const opinionSummaryDtos: OpinionSummaryDto[] = await OpinionSummaryApi.getForPolitician(context, parseInt(id));
        opinionSummaryDtos.sort((a, b) => b.id - a.id);

        if(!politicianDto)
            return {
                politician: null
            };

        const politician: Politician = {
            name: politicianDto.name,
            party: politicianDto.party,
            tweets: tweetsDto,
            sentiment: opinionSummaryDtos.length > 0 ? opinionSummaryDtos[0].sentiment : 5,
            sentimentHistory: opinionSummaryDtos
        };

        return {
            politician
        };
    }
    else {
        return {
            politician: null
        }
    }
};

export default PoliticianPage;
