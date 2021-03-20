import * as React from 'react'
import { Fade as MuiFade } from '@material-ui/core'
import { PropsWithChildren, useState } from 'react'
import { Waypoint } from 'react-waypoint'

type Props = PropsWithChildren<unknown>

const Fade: React.FC<Props> = (props: Props) => {
    const [visible, setVisible] = useState(false)

    const onEnter = () => {
        setVisible(true)
    }

    const onExit = () => {
        setVisible(false)
    }

    return (
        <Waypoint onEnter={onEnter} onLeave={onExit}>
            <MuiFade timeout={2000} in={visible}>
                <div>{props.children}</div>
            </MuiFade>
        </Waypoint>
    )
}

export default Fade
