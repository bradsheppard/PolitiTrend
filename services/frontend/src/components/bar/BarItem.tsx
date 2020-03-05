import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import { PropsWithChildren } from 'react';
import Link from 'next/link';

const styles = (theme: Theme) => createStyles({
    menuItem: {
        margin: theme.spacing(2),
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
            <Typography variant="subtitle1" component='a' className={classes.menuItem}>
                {props.children}
            </Typography>
        </Link>
    );
};

export default withStyles(styles)(BarItem);
