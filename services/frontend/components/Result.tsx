import * as React from 'react';
import Politician from '../model/Politician';
import { Avatar, Button, Card, CardActions, CardHeader, makeStyles, Typography } from '@material-ui/core';

interface IProps {
    Politician: Politician;
}

const useStyles = makeStyles(() => ({
    card: {
        margin: '2em'
    },
    sentiment: {
        margin: '1em'
    }
}));

const Result = (props: IProps) => {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <CardHeader avatar={<Avatar src='/avatar.jpg' />}
                        title={props.Politician.name}
                        subheader={props.Politician.party}
                        action={
                            <Typography className={classes.sentiment} color='primary'>
                                {props.Politician.sentiment}
                            </Typography>
                        }
            />
            <CardActions>
                <Button size="small" color="primary">
                    Share
                </Button>
            </CardActions>
        </Card>
    );
};

export default Result;
