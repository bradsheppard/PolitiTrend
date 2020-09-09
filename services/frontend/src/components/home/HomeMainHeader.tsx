import * as React from 'react';
import { PropsWithChildren } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Box, createStyles, Theme, Typography } from '@material-ui/core';

interface IProps extends PropsWithChildren<{}> {}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            marginTop: theme.spacing(8)
        }
    })
);

const HomeMainHeader = (props: IProps) => {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <Typography gutterBottom variant='h3' color='textPrimary' align='center'>
                <Box fontWeight='fontWeightBold'>
                    {props.children}
                </Box>
            </Typography>
        </div>
    );
}

export default HomeMainHeader;
