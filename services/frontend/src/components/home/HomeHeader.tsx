import * as React from 'react';
import { Box, Typography } from '@material-ui/core';
import { PropsWithChildren } from 'react';

interface IProps extends PropsWithChildren<{}> {}

const HomeHeader = (props: IProps) => {

    return (
        <Typography gutterBottom variant='h5' color='textPrimary'>
            <Box fontWeight='fontWeightBold'>
                {props.children}
            </Box>
        </Typography>
    );
};

export default HomeHeader;
