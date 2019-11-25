import * as React from 'react';
import { Avatar, Card, CardHeader, Typography, WithStyles } from '@material-ui/core';
import PoliticianOpinions from '../model/PoliticianOpinions';

interface IProps extends WithStyles {
    politicianOpinions: PoliticianOpinions
}

const PoliticianDetails = (props: IProps) => {
    const { classes, politicianOpinions } = props;
    const { politician } = politicianOpinions;

    return (
        <Card>
            <CardHeader avatar={<Avatar src='/avatar.jpg' />}
                        title={politician.name}
                        subheader={politician.party}
                        action={
                            <Typography className={classes.sentiment} color='primary'>
                                {politician.sentiment}
                            </Typography>
                        }
            />
        </Card>
    );
};

export default PoliticianDetails;