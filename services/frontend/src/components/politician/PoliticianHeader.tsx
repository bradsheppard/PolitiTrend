import * as React from 'react'
import { Theme, Typography } from '@material-ui/core'
import { PropsWithChildren } from 'react'
import PoliticianDivider from './PoliticianDivider'
import { makeStyles, createStyles } from '@material-ui/core/styles'

type Props = PropsWithChildren<unknown>

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            marginTop: theme.spacing(8),
        },
    })
)

const PoliticianHeader: React.FC<Props> = (props: Props) => {
    const classes = useStyles()

    return (
        <div className={classes.container}>
            <Typography gutterBottom variant="h4" color="textPrimary">
                {props.children}
            </Typography>
            <PoliticianDivider thickness={1} />
        </div>
    )
}

export default PoliticianHeader
