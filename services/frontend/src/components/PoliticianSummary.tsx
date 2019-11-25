import * as React from 'react';
import { createStyles, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import Politician from '../model/Politician';

const styles = (theme: Theme) => createStyles({
    sentiment: {
        margin: theme.spacing(2)
    },
    card: {
        margin: theme.spacing(4)
    }
});

interface IProps extends WithStyles<typeof styles> {
    politician: Politician;
}

const PoliticianSummary = (props: IProps) => {
    const { politician } = props;

    return (
        <React.Fragment>
            <Typography variant='h5' color='primary'>
                {politician.name}
            </Typography>
            <Typography variant='h6' color='primary'>
                {politician.party}
            </Typography>
        </React.Fragment>
    );
};

export default withStyles(styles)(PoliticianSummary);