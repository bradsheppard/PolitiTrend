import * as React from 'react'
import ContentContainer from '../components/common/ContentContainer'
import { Grid } from '@material-ui/core'
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles'
import CardDisplay from '../components/common/HeadlineCard'
import TransparentJumbo from '../components/common/TransparentJumbo'
import Typography from '@material-ui/core/Typography'
import Globals from '../utils/globals'

const styles = (theme: Theme) =>
    createStyles({
        menuItem: {
            margin: theme.spacing(3),
        },
        typography: {
            margin: theme.spacing(4),
        },
    })

type Props = WithStyles<typeof styles>

class About extends React.Component<Props> {
    constructor(props: Props) {
        super(props)
    }

    render() {
        const { classes } = this.props

        return (
            <React.Fragment>
                <TransparentJumbo>
                    <Typography variant="h1" align="center" style={{ color: 'white' }}>
                        {Globals.name}
                    </Typography>
                </TransparentJumbo>
                <ContentContainer>
                    <Typography
                        variant="h2"
                        color="secondary"
                        className={classes.typography}
                        align="center"
                    >
                        About
                    </Typography>
                    <Typography
                        variant="body1"
                        color="secondary"
                        className={classes.typography}
                        align="center"
                    >
                        {Globals.name} provides sentiment analysis of politicians through analyzing
                        a variety of different sources data sources (Twitter, News Articles, Blogs)
                        using Machine Learning Analytics. Content is analyzed daily and the
                        sentiment is tracked historically.
                    </Typography>
                    <Grid container alignItems="center" direction="row" justify="center">
                        <Grid item sm={4}>
                            <CardDisplay
                                className={classes.menuItem}
                                header="Word Clouds"
                                body="Examine word clouds of the most popular phrases/words used by politicians"
                            />
                        </Grid>
                        <Grid item sm={4}>
                            <CardDisplay
                                className={classes.menuItem}
                                header="Sentiment Analysis"
                                body="Determine the sentiment of particular politicians"
                            />
                        </Grid>
                        <Grid item sm={4}>
                            <CardDisplay
                                className={classes.menuItem}
                                header="Most Talked About"
                                body="Which politicians are the most mentioned in social media posts"
                            />
                        </Grid>
                        <Grid item sm={4}>
                            <CardDisplay
                                className={classes.menuItem}
                                header="Realtime"
                                body="News Articles / Tweets are monitored in near realtime. See trends as soon as they happen."
                            />
                        </Grid>
                        <Grid item sm={4}>
                            <CardDisplay
                                className={classes.menuItem}
                                header="No Political Bias"
                                body="Our algorithms are designed without political bias / preference. Conservative and liberal opinions are equally valued and weighted."
                            />
                        </Grid>
                    </Grid>
                </ContentContainer>
                <TransparentJumbo>
                    <Typography variant="h4" align="center" style={{ color: 'white' }}>
                        No Political Bias
                    </Typography>
                    <Typography variant="h5" align="center" style={{ color: 'white' }}>
                        Our algorithms are designed without political bias / preference.
                        Conservative and liberal opinions are equally valued and weighted.
                    </Typography>
                </TransparentJumbo>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(About)
