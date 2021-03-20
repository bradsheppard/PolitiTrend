import * as React from 'react'
import { PropsWithChildren } from 'react'
import { makeStyles } from '@material-ui/styles'
import { createStyles, Theme, Typography } from '@material-ui/core'

type Props = PropsWithChildren<unknown>

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            marginTop: theme.spacing(6),
        },
    })
)

const HomeMainHeader: React.FC = (props: Props) => {
    const classes = useStyles()

    return (
        <div className={classes.container}>
            <Typography gutterBottom variant="h2" color="textPrimary" align="center">
                {props.children}
            </Typography>
        </div>
    )
}

export default HomeMainHeader
