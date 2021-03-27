import * as React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme, Typography } from '@material-ui/core'
import { PropsWithChildren } from 'react'
import Divider from './Divider'

type Props = PropsWithChildren<unknown>

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            marginTop: theme.spacing(8),
        },
    })
)

const Header: React.FC<Props> = (props: Props) => {
    const classes = useStyles()

    return (
        <div className={classes.container}>
            <Typography gutterBottom variant="h3" color="textPrimary">
                {props.children}
            </Typography>
            <Divider />
        </div>
    )
}

export default Header
