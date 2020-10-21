import * as React from 'react'
import { Box, createStyles, Paper, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { PropsWithChildren } from 'react'
import clsx from 'clsx'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import ReactTooltip from 'react-tooltip'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            padding: theme.spacing(2),
            backgroundColor: theme.palette.primary.main,
            display: 'flex',
            justifyContent: 'space-between',
        },
        paper: {
            overflow: 'hidden',
        },
    })
)

interface IProps extends PropsWithChildren<unknown> {
    title: string
    description: string
}

const StatsCard: React.FC<IProps & React.HTMLAttributes<HTMLDivElement>> = (
    props: IProps & React.HTMLAttributes<HTMLDivElement>
) => {
    const classes = useStyles()

    return (
        <Paper className={clsx(classes.paper, props.className)} square={true} elevation={20}>
            <div className={classes.header}>
                <Typography variant="h6" style={{ color: 'white' }}>
                    <Box fontWeight="fontWeightBold">{props.title}</Box>
                </Typography>
                <HelpOutlineIcon data-tip={props.description} style={{ color: 'white' }} />
                <ReactTooltip />
            </div>
            {props.children}
        </Paper>
    )
}

export default StatsCard
