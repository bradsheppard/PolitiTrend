import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core';
import { FunctionComponent } from 'react';
import { PropsWithChildren } from 'react';

const useStyles = makeStyles((theme: Theme) => ({
    menuItem: {
        margin: theme.spacing(2)
    }
}));

const BarItem: FunctionComponent = (props: PropsWithChildren<{}>) => {
    const classes = useStyles();

    return (
        <Typography variant="h6" className={classes.menuItem}>
            {props.children}
        </Typography>
    );
};

export default BarItem;