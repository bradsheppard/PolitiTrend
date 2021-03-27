import * as React from 'react'
import Typography from '@material-ui/core/Typography'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { PropsWithChildren } from 'react'
import Link from 'next/link'

const styles = (theme: Theme) =>
    createStyles({
        menuItem: {
            margin: theme.spacing(3),
            color: 'white',
            textDecoration: 'none',
        },
    })

interface Props extends WithStyles<typeof styles>, PropsWithChildren<unknown> {
    link: string
}

const BarItem = (props: Props) => {
    const { classes, link } = props

    return (
        <Link href={link} passHref>
            <Typography variant="h6" component="a" className={classes.menuItem}>
                {props.children}
            </Typography>
        </Link>
    )
}

export default withStyles(styles)(BarItem)
