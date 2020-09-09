import * as React from 'react';
import { Divider as MuiDivider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    divider: {
        backgroundColor: 'black',
        height: (props: IProps) => props.thickness ? props.thickness : 3
    }
});

interface IProps {
    thickness?: number;
}

const Divider = (props: IProps) => {
    const classes = useStyles(props);

    return (
        <MuiDivider className={classes.divider} />
    );
};

export default Divider;
