import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

const style = () => createStyles({
    background: {
        background: `linear-gradient(to right, rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.75)), url(/image1.jpg) no-repeat`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover'
    },
    typography: {
        paddingBottom: '2em',
        paddingTop: '2em'
    }
});

interface IProps extends WithStyles<typeof style> {
}

const Jumbotron = (props: IProps) => {

    const {classes} = props;

    return (
        <div className={classes.background}>
            <Grid container={true}>
                <Grid item={true} xs={12}>
                    <Typography style={{color: 'white'}} className={classes.typography} variant='h1' align='center'>
                        polc
                    </Typography>
                </Grid>
            </Grid>
        </div>
    );
};

export default withStyles(style)(Jumbotron);

