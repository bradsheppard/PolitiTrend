import * as React from 'react'
import { politicianNameToImagePath } from '../../utils/ImagePath'
import { Avatar, Theme } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'

interface Politician {
    name: string
    party: string
    sentiment: number
}

interface Props {
    politician: Politician
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        large: {
            display: 'inline-block',
            width: theme.spacing(40),
            height: theme.spacing(40),
        },
    })
)

const PoliticianAvatar: React.FC<Props> = (props: Props) => {
    const { politician } = props
    const classes = useStyles()

    return (
        <Avatar
            variant="circle"
            alt={politician.name}
            src={politicianNameToImagePath(politician.name)}
            className={classes.large}
        />
    )
}

export default PoliticianAvatar
