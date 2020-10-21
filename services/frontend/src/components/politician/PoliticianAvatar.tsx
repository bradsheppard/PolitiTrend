import * as React from 'react'
import { politicianNameToImagePath } from '../../utils/ImagePath'
import { Avatar, createStyles, makeStyles, Theme } from '@material-ui/core'

interface Politician {
    name: string
    party: string
    sentiment: number
}

interface IProps {
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

const PoliticianAvatar: React.FC<IProps> = (props: IProps) => {
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
