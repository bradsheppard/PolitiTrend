import * as React from 'react';
import {
    Avatar,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader, createStyles,
    Fade, Theme,
    Typography, WithStyles, withStyles
} from '@material-ui/core';
import { Tweet } from 'react-twitter-widgets'
import ScrollTrigger from 'react-scroll-trigger';
import PoliticianOpinions from '../model/PoliticianOpinions';
import Opinion from '../model/Opinion';

interface IProps extends WithStyles<typeof styles> {
    politicianOpinions: PoliticianOpinions;
}

interface IState {
    visible: boolean;
}

const styles = (theme: Theme) => createStyles({
    tweet: {
        '.EmbeddedTweet': {
            'max-width': '10000px'
        },
        '.element': {
            'max-width': '10000px'
        }
    },
    card: {
        margin: theme.spacing(4)
    },
    sentiment: {
        margin: theme.spacing(2)
    }
});

class Result extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            visible: false
        }
    }

    onEnterViewport() {
        this.setState({
            visible: true
        });
    }

    onExitViewport() {
        this.setState({
            visible: false
        });
    }

    render () {
        const { classes } = this.props;

        return (
            // @ts-ignore
            <ScrollTrigger onEnter={this.onEnterViewport.bind(this)} onExit={this.onExitViewport.bind(this)}>
                <Fade in={this.state.visible} timeout={2000}>
                    <Card className={classes.card} elevation={1}>
                        <CardHeader avatar={<Avatar src='/avatar.jpg' />}
                                    title={this.props.politicianOpinions.politician.name}
                                    subheader={this.props.politicianOpinions.politician.party}
                                    action={
                                        <Typography className={classes.sentiment} color='primary'>
                                            {this.props.politicianOpinions.politician.sentiment}
                                        </Typography>
                                    }
                        />
                        <CardContent>
                            {
                                this.props.politicianOpinions.opinions.map((opinion: Opinion, index) => {
                                    return (
                                        <Tweet
                                            options={{
                                                align: 'center'
                                            }}
                                            tweetId={opinion.tweetId}
                                            key={index}
                                        />
                                    )
                                })
                            }
                        </CardContent>
                        <CardActions>
                            <Button size="small" color="primary">
                                Share
                            </Button>
                        </CardActions>
                    </Card>
                </Fade>
            </ScrollTrigger>
        );
    }
}

export default withStyles(styles)(Result);
