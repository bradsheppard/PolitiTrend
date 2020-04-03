import * as React from 'react';
import { Divider as MuiDivider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    divider: {
        backgroundColor: 'black',
        height: 2
    }
});

const Divider = () => {
    const classes = useStyles();

    return (
        <MuiDivider className={classes.divider} />
    );
};

export default Divider;
