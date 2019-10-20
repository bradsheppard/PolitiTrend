import * as React from 'react';
import Legislator from '../model/Legislator';
import { Avatar, Button, Card, CardActions, CardHeader, IconButton, makeStyles, Typography } from '@material-ui/core';

interface IProps {
    legislator: Legislator;
}

const useStyles = makeStyles(() => ({
    card: {
        margin: '2em'
    }
}));

const Result = (props: IProps) => {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <CardHeader avatar={<Avatar src='/avatar.jpg' />}
                        title={props.legislator.name}
                        subheader={props.legislator.party}
                        action={
                            <IconButton>
                                <Typography>
                                    {props.legislator.sentiment}
                                </Typography>
                            </IconButton>
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
