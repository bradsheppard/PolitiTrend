import * as React from 'react'
import { Card, createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core'
import PoliticianAvatar from './PoliticianAvatar'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        profileParagraph: {
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
        },
        profileCard: {
            paddingTop: theme.spacing(4),
            background: 'none',
        },
    })
)

interface Politician {
    name: string
    party: string
    sentiment: number
    role: string
}

interface Props {
    politician: Politician
}

const PoliticianHeader: React.FC<Props> = (props: Props) => {
    const { politician } = props
    const classes = useStyles()

    return (
        <Card className={classes.profileCard} elevation={0}>
            <Grid item sm={12}>
                <PoliticianAvatar politician={politician} />
            </Grid>
            <Grid item sm={12}>
                <Typography variant="h4" color="textPrimary">
                    {props.politician.name}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    {props.politician.party}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    {props.politician.role}
                </Typography>
            </Grid>
        </Card>
    )
}

export default PoliticianHeader
