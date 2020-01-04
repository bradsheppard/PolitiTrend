import * as React from 'react';
import {
    Avatar,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader, Collapse, createStyles,
    Fade, IconButton, Theme,
    Typography, WithStyles, withStyles
} from '@material-ui/core';
import { Tweet } from 'react-twitter-widgets'
import { Waypoint } from 'react-waypoint';
import Opinion from '../model/Opinion';
import { ExpandMore } from '@material-ui/icons'
import clsx from 'clsx';
import { politicianNameToImagePath } from '../utils/ImagePath';
import Politician from '../model/Politician';

interface IProps extends WithStyles<typeof styles> {
    politician: Politician;
}

interface IState {
    visible: boolean;
    expanded: boolean;
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
                    <Card className={classes.card} elevation={1}>
                        <CardHeader avatar={<Avatar src={politicianNameToImagePath(this.props.politician.name)}/>}
                                    title={this.props.politician.name}
                                    subheader={this.props.politician.party}
                                    action={
                                        <Typography className={classes.sentiment} color='primary'>
                                            {this.props.politician.sentiment.toFixed(1)}
                                        </Typography>
                                    }
                        />
                        <CardContent>
                            {
                                this.props.politician.opinions.slice(0, 1).map((opinion: Opinion, index) => {
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
                        <Collapse in={this.state.expanded} timeout='auto' unmountOnExit>
                            <CardContent>
                                {
                                    this.props.politician.opinions.slice(1).map((opinion: Opinion, index) => {
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
