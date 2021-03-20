import * as React from 'react'
import { Card as MuiCard } from '@material-ui/core'
import { PropsWithChildren } from 'react'

type Props = PropsWithChildren<unknown>

const Card: React.FC = (props: Props & React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <MuiCard className={props.className} variant="outlined">
            {props.children}
        </MuiCard>
    )
}

export default Card
