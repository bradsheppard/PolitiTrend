import * as React from 'react'
import { Card, CardContent, Theme, Typography } from '@material-ui/core'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'

interface Props extends WithStyles<typeof style> {
    header: string
    body: string
    className?: string
}

const style = (theme: Theme) =>
    createStyles({
        typography: {
            margin: theme.spacing(2),
        },
    })

const HeadlineCard = (props: Props) => {
    return (
        <Card className={props.className} raised={true}>
            <CardContent>
                <Typography variant="h5" align="center" className={props.classes.typography}>
                    {props.header}
                </Typography>
                <Typography variant="body2" align="center">
                    {props.body}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default withStyles(style)(HeadlineCard)
