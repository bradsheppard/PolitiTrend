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
import ScrollTrigger from 'react-scroll-trigger';
import PoliticianOpinions from '../model/PoliticianOpinions';
import Opinion from '../model/Opinion';
import { ExpandMore } from '@material-ui/icons'
import clsx from 'clsx';

interface IProps extends WithStyles<typeof styles> {
    politicianOpinions: PoliticianOpinions;
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

class Result extends React.Component<IProps, IState> {

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
            <ScrollTrigger onEnter={this.onEnterViewport.bind(this)} onExit={this.onExitViewport.bind(this)}>
                <Fade in={this.state.visible} timeout={2000}>
                    <Card className={classes.card} elevation={1}>
                        <CardHeader avatar={<Avatar src={`/${this.props.politicianOpinions.politician.name.replace(' ', '_')}.jpg`}/>}
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
                                this.props.politicianOpinions.opinions.slice(0, 1).map((opinion: Opinion, index) => {
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
                                    this.props.politicianOpinions.opinions.slice(1).map((opinion: Opinion, index) => {
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
            </ScrollTrigger>
        );
    }
}

export default withStyles(styles)(Result);
