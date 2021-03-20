import * as React from 'react'
import { Avatar, createStyles, Link as MuiLink, Theme, Typography } from '@material-ui/core'
import { toDate } from '../../utils/StringUtils'
import { AvatarGroup } from '@material-ui/lab'
import { politicianNameToImagePath } from '../../utils/ImagePath'
import { makeStyles } from '@material-ui/styles'

interface HomeNewsArticle {
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
    newsArticle: HomeNewsArticle
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

const NewsArticle: React.FC<Props> = (props: Props) => {
    const classes = useStyles()

    return (
        <MuiLink href={props.newsArticle.url} className={classes.paper} underline="none">
            <div className={classes.container}>
                <div>
                    <Typography gutterBottom variant="h4" color="primary">
                        {capitalize(props.newsArticle.summary)}
                    </Typography>
                    <Typography gutterBottom variant="subtitle1" color="textSecondary">
                        {toDate(props.newsArticle.dateTime)}
                    </Typography>
                    <Typography gutterBottom variant="subtitle1" color="textSecondary">
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

export default NewsArticle
