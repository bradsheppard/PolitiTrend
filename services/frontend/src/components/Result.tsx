import * as React from 'react';
import Politician from '../model/Politician';
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

interface IProps extends WithStyles<typeof styles> {
    politician: Politician;
}

interface IState {
    visible: boolean;
}

const styles = (theme: Theme) => createStyles({
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
                                    title={this.props.politician.name}
                                    subheader={this.props.politician.party}
                                    action={
                                        <Typography className={classes.sentiment} color='primary'>
                                            {this.props.politician.sentiment}
                                        </Typography>
                                    }
                        />
                        <CardContent>
                            <Tweet
                                options={{
                                    align: 'center'
                                }}
                                tweetId={'933354946111705097'}
                            />
                            <Tweet
                                options={{
                                    align: 'center'
                                }}
                                tweetId={'933354946111705097'}
                            />
                            <Tweet
                                options={{
                                    align: 'center'
                                }}
                                tweetId={'933354946111705097'}
                            />
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
