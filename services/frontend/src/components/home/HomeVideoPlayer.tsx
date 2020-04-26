import * as React from 'react';
import { Box, createStyles, Grid, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import YouTube from 'react-youtube';
import { useState } from 'react';

interface IProps {
    videos: Video[];
}

interface Video {
    videoId: string;
    thumbnail: string;
    title: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            height: theme.spacing(70)
        },
        image: {
            position: 'absolute',
            width: '100%',
            margin: 'auto',
            top: '-100%',
            bottom: '-100%',
            left: '-100%',
            right: '-100%'
        },
        imageContainer: {
            position: 'relative',
            overflow: 'hidden',
            height: theme.spacing(15)
        },
        title: {
            paddingLeft: theme.spacing(1)
        },
        sideVideo: {
            cursor: 'pointer',
            paddingLeft: theme.spacing(1),
            paddingBottom: theme.spacing(1)
        },
        videoPlayer: {
            width: '100%',
            height: theme.spacing(70)
        },
        sideVideoContainer: {
            height: '100%',
            overflow: 'scroll'
        }
    })
);

const HomeVideoPlayer = (props: IProps) => {
    const classes = useStyles();
    const [playingVideo, setPlayingVideo] = useState(0);

    const onVideoClick = (index: number) => {
        setPlayingVideo(index);
    };

    return (
        <Grid container className={classes.container}>
            <Grid xs={8}>
                <YouTube videoId={props.videos[playingVideo].videoId} className={classes.videoPlayer} />
            </Grid>
            <Grid item xs={4} className={classes.sideVideoContainer}>
                <div>
                    <Grid container>
                    {
                        props.videos.map((video: Video, index: number) => {
                            return (
                                <Grid item xs={12}>
                                    <div onClick={() => onVideoClick(index)} className={classes.sideVideo}>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <div className={classes.imageContainer}>
                                                    <img className={classes.image} src={video.thumbnail} alt={video.title} />
                                                </div>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography className={classes.title} gutterBottom variant='subtitle1' color='textPrimary'>
                                                    <Box fontWeight='fontWeightBold'>
                                                        Source: {video.title}
                                                    </Box>
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </Grid>
                            );
                        })
                    }
                    </Grid>
                </div>
            </Grid>
        </Grid>
    );
};

export default HomeVideoPlayer;
