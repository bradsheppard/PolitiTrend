import * as React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

interface IProps {
    video: Video;
}

interface Video {
    title: string;
    videoId: string;
    thumbnail: string;
}

const useStyles = makeStyles({
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
        height: '20em'
    },
});

const Video = (props: IProps) => {
    const classes = useStyles();

    return (
        <div>
            <div className={classes.imageContainer}>
                <img className={classes.image} src={props.video.thumbnail} alt={props.video.title} />
            </div>
            <Typography variant='h4' color='textPrimary'>
                {props.video.title}
            </Typography>
        </div>
    );
}

export default Video;
