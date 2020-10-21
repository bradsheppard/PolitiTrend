import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import * as React from 'react'
import { PropsWithChildren } from 'react'

const style = () =>
    createStyles({
        background: {
            background: `linear-gradient(to right, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.75)), url(/image2.jpg) no-repeat`,
            // background: `linear-gradient(to right, rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.75)), no-repeat`,
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
        },
        text: {
            paddingBottom: '8em',
            paddingTop: '8em',
        },
    })

interface IProps extends WithStyles<typeof style>, PropsWithChildren<unknown> {}

const TransparentJumbo = (props: IProps) => {
    const { classes } = props

    return (
        <div className={classes.background}>
            <Grid container={true}>
                <Grid item={true} xs={12}>
                    <div className={classes.text}>{props.children}</div>
                </Grid>
            </Grid>
        </div>
    )
}

export default withStyles(style)(TransparentJumbo)
