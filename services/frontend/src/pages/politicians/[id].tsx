import * as React from 'react';
import { Typography } from '@material-ui/core';
import PoliticianOpinions from '../../model/PoliticianOpinions';
import PoliticianDetails from '../../components/PoliticianDetails';
import { NextPageContext } from 'next';
import PoliticianOpinionsApi from '../../model/PoliticianOpinionsApi';
import ContentContainer from '../../components/ContentContainer';

interface IProps {
    politicianOpinions: PoliticianOpinions | null;
}

const PoliticianPage = (props: IProps) => {
    if(!props.politicianOpinions)
        return (
            <Typography>Not Found</Typography>
        );

    return (
        <ContentContainer>
            <PoliticianDetails politicianOpinions={props.politicianOpinions} />
        </ContentContainer>
    )
};

PoliticianPage.getInitialProps = async function(context: NextPageContext): Promise<IProps> {
    const { id } = context.query;
    if (typeof id === 'string') {
        const politicianOpinions: PoliticianOpinions | null = await PoliticianOpinionsApi.getOne(context, parseInt(id));
        return {
            politicianOpinions
        };
    }
    else {
        return {
            politicianOpinions: null
        }
    }
};

export default PoliticianPage;