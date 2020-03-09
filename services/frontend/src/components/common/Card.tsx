import * as React from 'react';
import { Card as MuiCard } from '@material-ui/core';
import { PropsWithChildren } from 'react';

interface IProps extends PropsWithChildren<{}> {}

const Card = (props: IProps & React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <MuiCard className={props.className} variant='outlined'>
            {props.children}
        </MuiCard>
    );
};

export default Card;