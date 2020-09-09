import * as React from 'react';
import { Box, createStyles, Theme, Typography } from '@material-ui/core';
import { PropsWithChildren } from 'react';
import Divider from '../common/Divider';
import { makeStyles } from '@material-ui/styles';

interface IProps extends PropsWithChildren<{}> {}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            marginTop: theme.spacing(8)
        }
    })
);

const HomeHeader = (props: IProps) => {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <Typography gutterBottom variant='h3' color='textPrimary'>
                <Box fontWeight='fontWeightBold'>
                    {props.children}
                </Box>
            </Typography>
            <Divider />
        </div>
    );
};

export default HomeHeader;
