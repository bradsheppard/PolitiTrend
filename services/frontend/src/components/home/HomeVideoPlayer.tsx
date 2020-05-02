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
            height: theme.spacing(70),
            background: '#1a1a1a',
            padding: theme.spacing(5)
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
            paddingLeft: theme.spacing(1),
            color: '#fff'
        },
        sideVideo: {
            cursor: 'pointer',
            paddingLeft: theme.spacing(1),
            paddingBottom: theme.spacing(1)
        },
        videoPlayer: {
            width: '100%',
            height: '100%'
        },
        sideVideoContainer: {
            height: '100%',
            overflow: 'scroll',
            overflowX: 'hidden'
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
            <Grid xs={8} className={classes.videoPlayer}>
                <YouTube videoId={props.videos[playingVideo].videoId}
                         className={classes.videoPlayer}
                         containerClassName={classes.videoPlayer} />
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
                                                <Typography className={classes.title} gutterBottom variant='subtitle1'>
                                                    <Box fontWeight='fontWeightBold'>
                                                        {video.title}
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
