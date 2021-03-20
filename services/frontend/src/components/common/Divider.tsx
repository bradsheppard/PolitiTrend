import * as React from 'react'
import { Divider as MuiDivider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
    divider: {
        backgroundColor: 'black',
        height: (props: Props) => (props.thickness ? props.thickness : 3),
    },
})

interface Props {
    thickness?: number
}

const Divider: React.FC<Props> = (props: Props) => {
    const classes = useStyles(props)

    return <MuiDivider className={classes.divider} />
}

export default Divider
