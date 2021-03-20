import * as React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Typography, Link as MuiLink } from '@material-ui/core'

interface Props {
    video: Video
}

interface Video {
    title: string
    videoId: string
    thumbnail: string
}

const useStyles = makeStyles({
    image: {
        position: 'absolute',
        width: '100%',
        margin: 'auto',
        top: '-100%',
        bottom: '-100%',
        left: '-100%',
        right: '-100%',
    },
    imageContainer: {
        position: 'relative',
        overflow: 'hidden',
        height: '20em',
    },
})

const Video: React.FC<Props> = (props: Props) => {
    const classes = useStyles()

    return (
        <MuiLink href={`http://www.youtube.com/watch?v=${props.video.videoId}`} underline="none">
            <div className={classes.imageContainer}>
                <img
                    className={classes.image}
                    src={props.video.thumbnail}
                    alt={props.video.title}
                />
            </div>
            <Typography variant="h4" color="textPrimary">
                {props.video.title}
            </Typography>
        </MuiLink>
    )
}

export default Video
