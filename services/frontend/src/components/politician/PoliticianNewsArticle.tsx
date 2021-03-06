import * as React from 'react'
import { Avatar, Link as MuiLink, Theme, Typography } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { toDate } from '../../utils/date'
import { AvatarGroup } from '@material-ui/lab'
import { politicianNameToImagePath } from '../../utils/images'

interface NewsArticle {
    summary: string
    url: string
    source: string
    dateTime: string
    politicians: Politician[]
}

interface Politician {
    name: string
    party: string
}

interface Props {
    newsArticle: NewsArticle
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        avatar: {
            width: theme.spacing(10),
            height: theme.spacing(10),
        },
        paper: {
            padding: theme.spacing(2),
            height: '100%',
        },
        container: {
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            height: '100%',
        },
    })
)

const capitalize = (inputString: string) => {
    return inputString.replace(/\b\w/g, (l) => l.toUpperCase())
}

const PoliticianNewsArticle: React.FC<Props> = (props: Props) => {
    const classes = useStyles()

    return (
        <MuiLink href={props.newsArticle.url} className={classes.paper} underline="none">
            <div className={classes.container}>
                <div>
                    <Typography gutterBottom variant="h5" color="primary">
                        {capitalize(props.newsArticle.summary)}
                    </Typography>
                    <Typography gutterBottom variant="subtitle2" color="textSecondary">
                        {toDate(props.newsArticle.dateTime)}
                    </Typography>
                    <Typography gutterBottom variant="subtitle2" color="textSecondary">
                        Source: {props.newsArticle.source}
                    </Typography>
                </div>
                <AvatarGroup max={4}>
                    {props.newsArticle.politicians.map((politician, index) => (
                        <Avatar
                            alt={politician.name}
                            src={politicianNameToImagePath(politician.name)}
                            key={index}
                            className={classes.avatar}
                        />
                    ))}
                </AvatarGroup>
            </div>
        </MuiLink>
    )
}

export default PoliticianNewsArticle
