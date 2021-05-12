import * as React from 'react'
import { politicianNameToImagePath } from '../../utils/images'
import { Link as MuiLink, Theme, Typography } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Image from 'next/image'
import { ThumbDown, ThumbUp, ThumbsUpDown } from '@material-ui/icons'
import { scaleSentiment } from '../../utils/sentiment'

interface Politician {
    id: number
    name: string
    party: string
    role: string
    sentiment: number
    sampleSize: number
}

interface Props {
    politician: Politician
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        image: {
            position: 'absolute',
            margin: 'auto',
            width: '100%',
            top: '-80%',
            bottom: '-100%',
            left: '-100%',
            right: '-100%',
        },
        imageContainer: {
            marginRight: theme.spacing(2),
            position: 'relative',
            float: 'left',
            overflow: 'hidden',
            borderRadius: '50%',
            height: theme.spacing(20),
            width: theme.spacing(20),
        },
        icon: {
            marginLeft: 'auto',
            display: 'flex',
            flexDirection: 'column',
        },
        container: {
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'space-between',
        },
        numPosts: {
            marginTop: 'auto',
        },
    })
)

const HomePolitician: React.FC<Props & React.HTMLAttributes<HTMLDivElement>> = (
    props: Props & React.HTMLAttributes<HTMLDivElement>
) => {
    const classes = useStyles()

    const roundedSentiment = scaleSentiment(props.politician.sentiment)

    return (
        <MuiLink href={`/politicians/${props.politician.id}`} underline="none">
            <div className={clsx(props.className, classes.container)}>
                <div className={classes.imageContainer}>
                    <Image
                        src={politicianNameToImagePath(props.politician.name)}
                        alt="x"
                        layout="fill"
                        objectFit="cover"
                        key={props.politician.id}
                    />
                </div>
                <div>
                    <Typography variant="h5" color="textPrimary">
                        {props.politician.name}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {props.politician.party}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {props.politician.role}
                    </Typography>
                </div>
                <div className={classes.icon}>
                    {(() => {
                        if (roundedSentiment < 5)
                            return (
                                <div>
                                    <ThumbDown fontSize="large" />
                                    <Typography variant="subtitle1">Disliked</Typography>
                                </div>
                            )
                        else if (roundedSentiment > 5)
                            return (
                                <div>
                                    <ThumbUp fontSize="large" />
                                    <Typography variant="subtitle1">Liked</Typography>
                                </div>
                            )
                        else
                            return (
                                <div>
                                    <ThumbsUpDown fontSize="large" />
                                    <Typography variant="subtitle1">Neutral</Typography>
                                </div>
                            )
                    })()}
                    <div className={classes.numPosts}>
                        <Typography variant="subtitle2">
                            {Math.round(props.politician.sampleSize)} Posts
                        </Typography>
                    </div>
                </div>
            </div>
        </MuiLink>
    )
}

export default HomePolitician
