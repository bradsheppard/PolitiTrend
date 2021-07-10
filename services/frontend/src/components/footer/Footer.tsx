import * as React from 'react'
import { makeStyles } from '@material-ui/styles'
import { createStyles } from '@material-ui/core/styles'
import { Grid, Theme, Typography } from '@material-ui/core'
import ContentContainer from '../common/ContentContainer'
import FacebookIcon from '@material-ui/icons/Facebook'
import TwitterIcon from '@material-ui/icons/Twitter'
import Globals from '../../utils/globals'
import Link from 'next/link'

const useStyle = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            backgroundColor: 'rgb(26,27,31)',
            color: '#ffffff',
            paddingTop: theme.spacing(4),
            paddingBottom: theme.spacing(4),
        },
        typography: {
            fontWeight: 'bold',
            margin: theme.spacing(1),
            cursor: 'pointer',
        },
        title: {
            marginBottom: theme.spacing(4),
        },
        follow: {
            marginBottom: theme.spacing(1),
            fontWeight: 'bold',
        },
        icon: {
            marginRight: theme.spacing(3),
        },
        copyright: {
            fontStyle: 'italic',
            fontWeight: 'bold',
        },
    })
)

const Footer: React.FC = () => {
    const classes = useStyle()

    return (
        <div className={classes.container}>
            <ContentContainer>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="h4" className={classes.title}>
                            {Globals.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="body1" className={classes.follow}>
                            Follow Us
                        </Typography>
                        <FacebookIcon className={classes.icon} />
                        <TwitterIcon className={classes.icon} />
                    </Grid>
                    <Grid item xs={4}>
                        <Link href="" passHref>
                            <Typography variant="body2" className={classes.typography}>
                                Home
                            </Typography>
                        </Link>
                        <Link href="/politicians" passHref>
                            <Typography variant="body2" className={classes.typography}>
                                Politicians
                            </Typography>
                        </Link>
                        <Link href="/stats" passHref>
                            <Typography variant="body2" className={classes.typography}>
                                Stats
                            </Typography>
                        </Link>
                    </Grid>
                    <Grid item xs={4}>
                        <Link href="/about" passHref>
                            <Typography variant="body2" className={classes.typography}>
                                About Us
                            </Typography>
                        </Link>
                        <Typography variant="body2" className={classes.typography}>
                            Contact
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" className={classes.copyright}>
                            Copyright © PolitiTrend, 2021. All rights reserved.
                        </Typography>
                    </Grid>
                </Grid>
            </ContentContainer>
        </div>
    )
}

export default Footer
