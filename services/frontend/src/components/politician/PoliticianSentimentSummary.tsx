import * as React from 'react';
import {
    Avatar,
    Button,
    CardActions,
    CardContent,
    CardHeader, Collapse, createStyles,
    Fade, IconButton, Link as MuiLink, Theme,
    Typography, WithStyles, withStyles
} from '@material-ui/core';
import { Tweet as TweetWidget } from 'react-twitter-widgets'
import { Waypoint } from 'react-waypoint';
import { ExpandMore } from '@material-ui/icons'
import clsx from 'clsx';
import { politicianNameToImagePath } from '../../utils/ImagePath';
import Link from 'next/link';
import Card from '../common/Card';

interface IProps extends WithStyles<typeof styles> {
    politician: Politician;
}

interface IState {
    visible: boolean;
    expanded: boolean;
}

interface Politician {
    id: number;
    name: string;
    party: string;
    sentiment: number;
    tweets: Tweet[];
}

interface Tweet {
    tweetId: string;
    tweetText: string;
}

const styles = (theme: Theme) => createStyles({
    card: {
        margin: theme.spacing(4)
    },
    sentiment: {
        margin: theme.spacing(2)
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    }
});

class PoliticianSentimentSummary extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            visible: false,
            expanded: false
        }
    }

    handleExpandClick() {
        this.setState({
            expanded: !this.state.expanded
        });
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
            <Waypoint onEnter={this.onEnterViewport.bind(this)} onLeave={this.onExitViewport.bind(this)}>
                <Fade in={this.state.visible} timeout={2000}>
                    <Card className={classes.card}>
                        <Link href='/politicians/[id]' as={`/politicians/${this.props.politician.id}`}>
                            <MuiLink href='#' underline='none'>
                                <CardHeader avatar={<Avatar src={politicianNameToImagePath(this.props.politician.name)}/>}
                                            title={this.props.politician.name}
                                            subheader={this.props.politician.party}
                                            action={
                                                <Typography className={classes.sentiment} color='primary'>
                                                    {this.props.politician.sentiment.toFixed(1)}
                                                </Typography>
                                            }
                                />
                            </MuiLink>
                        </Link>
                        <CardContent>
                            {
                                this.props.politician.tweets.slice(0, 1).map((tweet: Tweet, index) => {
                                    return (
                                        <TweetWidget
                                            options={{
                                                align: 'center'
                                            }}
                                            tweetId={tweet.tweetId}
                                            key={index}
                                        />
                                    )
                                })
                            }
                        </CardContent>
                        <Collapse in={this.state.expanded} timeout='auto' unmountOnExit>
                            <CardContent>
                                {
                                    this.props.politician.tweets.slice(1).map((tweet: Tweet, index) => {
                                        return (
                                            <TweetWidget
                                                options={{
                                                    align: 'center'
                                                }}
                                                tweetId={tweet.tweetId}
                                                key={index}
                                            />
                                        )
                                    })
                                }
                            </CardContent>
                        </Collapse>
                        <CardActions>
                            <Button size="small" color="primary">
                                Share
                            </Button>
                            <IconButton
                                className={clsx(classes.expand, {
                                    [classes.expandOpen]: this.state.expanded,
                                })}
                                onClick={this.handleExpandClick.bind(this)}
                                aria-expanded={this.state.expanded}
                                aria-label="show more"
                            >
                                <ExpandMore />
                            </IconButton>
                        </CardActions>
                    </Card>
                </Fade>
            </Waypoint>
        );
    }
}

export default withStyles(styles)(PoliticianSentimentSummary);
