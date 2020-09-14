import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { Box, createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import { PropsWithChildren } from 'react';
import Link from 'next/link';

const styles = (theme: Theme) => createStyles({
    menuItem: {
        margin: theme.spacing(3),
        color: 'white',
        textDecoration: 'none'
    }
});

interface IProps extends WithStyles<typeof styles>, PropsWithChildren<{}> {
    link: string;
}

const BarItem = (props: IProps) => {
    const { classes, link } = props;

    return (
        <Link href={link} passHref>
            <Typography variant='h6' component='a' className={classes.menuItem}>
                {props.children!.toString()}
            </Typography>
        </Link>
    );
};

export default withStyles(styles)(BarItem);
