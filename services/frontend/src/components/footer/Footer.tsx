import * as React from 'react';
import { makeStyles } from '@material-ui/styles';
import { createStyles, Grid, Theme, Typography } from '@material-ui/core';
import ContentContainer from '../common/ContentContainer';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';

const useStyle = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            backgroundColor: '#000000',
            color: '#ffffff',
            paddingTop: theme.spacing(4),
            paddingBottom: theme.spacing(4)
        },
        typography: {
            fontWeight: 'bold',
            margin: theme.spacing(1)
        },
        title: {
            marginBottom: theme.spacing(4)
        },
        follow: {
            marginBottom: theme.spacing(1),
            fontWeight: 'bold'
        },
        icon: {
            marginRight: theme.spacing(3)
        },
        copyright: {
            fontStyle: 'italic',
            fontWeight: 'bold'
        }
    }
));

const Footer = () => {
    const classes = useStyle();

    return (
        <div className={classes.container}>
            <ContentContainer>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant='h4' className={classes.title}>
                            Voyce
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant='body1' className={classes.follow}>
                            Follow Us
                        </Typography>
                        <FacebookIcon className={classes.icon} />
                        <TwitterIcon className={classes.icon} />
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant='body2' className={classes.typography}>
                            Home
                        </Typography>
                        <Typography variant='body2' className={classes.typography}>
                            Politicians
                        </Typography>
                        <Typography variant='body2' className={classes.typography}>
                            Stats
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant='body2' className={classes.typography}>
                            About Us
                        </Typography>
                        <Typography variant='body2' className={classes.typography}>
                            Contact
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='subtitle1' className={classes.copyright}>
                            Copyright © Voyce, 2020. All rights reserved.
                        </Typography>
                    </Grid>
                </Grid>
            </ContentContainer>
        </div>
    );
};

export default Footer;
