import * as React from 'react';
import { Grid, Typography } from '@material-ui/core';
import Politician from '../../model/Politician';
import { politicianNameToImagePath } from '../../utils/ImagePath';
import { NextPageContext } from 'next';
import PoliticianApi from '../../model/PoliticianApi';

interface IProps {
    politician: Politician;
}

const PoliticianPage = (props: IProps) => {
    if(!props.politician)
        return (
            <Typography>Not Found</Typography>
        );

    return (
        <Grid container
            alignItems='center'
            justify='center'>
            <Grid item
                sm={8}>
                <img src={politicianNameToImagePath(props.politician.name)} alt={props.politician.name} />
                <Typography variant='h2' color='primary'>
                    {props.politician.name}
                </Typography>
            </Grid>
        </Grid>
    )
};

PoliticianPage.getInitialProps = async function(context: NextPageContext) {
    const { id } = context.query;
    console.log('trying ' + id);
    if (typeof id === 'string') {
        const politician: Politician | null = await PoliticianApi.getOne(context, parseInt(id));
        return { politician: politician };
    }
    else {
        return {
            politician: null
        }
    }
};

export default PoliticianPage;