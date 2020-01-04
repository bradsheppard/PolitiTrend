import * as React from 'react';
import { Typography } from '@material-ui/core';
import PoliticianDetails from '../../components/PoliticianDetails';
import { NextPageContext } from 'next';
import ContentContainer from '../../components/ContentContainer';
import Politician from '../../model/Politician';
import PoliticianApi from '../../model/PoliticianApi';

interface IProps {
    politician: Politician | null;
}

const PoliticianPage = (props: IProps) => {
    if(!props.politician)
        return (
            <Typography>Not Found</Typography>
        );

    return (
        <ContentContainer>
            <PoliticianDetails politician={props.politician} />
        </ContentContainer>
    )
};

PoliticianPage.getInitialProps = async function(context: NextPageContext): Promise<IProps> {
    const { id } = context.query;
    if (typeof id === 'string') {
        const politician: Politician | null = await PoliticianApi.getOne(context, parseInt(id));
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
