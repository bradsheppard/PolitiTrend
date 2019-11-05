import * as React from 'react';
import { createStyles, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import { PropsWithChildren } from 'react';

const style = (theme: Theme) => createStyles({
    typography: {
        margin: theme.spacing(4)
    }
});

interface IProps extends WithStyles<typeof style>, PropsWithChildren<{}> {}

const ResultHeader = (props: IProps) => {
    return (
        <Typography variant='h4' color='primary' className={props.classes.typography}>
            {props.children}
        </Typography>
    );
};

export default withStyles(style)(ResultHeader);
