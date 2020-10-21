import * as React from 'react'
import { useEffect, useState } from 'react'
import YoutubeVideoApi from '../../apis/video/youtube/YoutubeVideoApi'
import VideoPlayer from '../common/VideoPlayer'
import { makeStyles } from '@material-ui/styles'
import { createStyles, Theme } from '@material-ui/core'

interface IProps {
    politician: number
}

interface YoutubeVideo {
    title: string
    videoId: string
    thumbnail: string
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            marginTop: theme.spacing(4),
            marginBottom: theme.spacing(4),
        },
    })
)

const PoliticianVideoFeed: React.FC<IProps> = (props: IProps) => {
    const classes = useStyles()
    const [videos, setVideos] = useState<YoutubeVideo[]>([])

    useEffect(() => {
        ;(async () => {
            const fetchedVideos = await YoutubeVideoApi.get({
                politician: props.politician,
                limit: 6,
            })
            setVideos(fetchedVideos)
        })()
    })

    if (videos.length === 0) return null

    return (
        <div className={classes.container}>
            <VideoPlayer videos={videos} height={50} />
        </div>
    )
}

export default PoliticianVideoFeed
