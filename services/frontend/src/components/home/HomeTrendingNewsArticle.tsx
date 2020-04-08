import * as React from 'react';
import { Box, createStyles, Grid, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

interface IProps {
    newsArticle: NewsArticle;
}

interface NewsArticle {
    title: string;
    description: string;
    image: string;
    url: string;
    source: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        imageContainer: {
            position: 'relative',
            overflow: 'hidden',
            height: theme.spacing(40),
        },
        image: {
            position: 'absolute',
            height: '100%',
            margin: 'auto',
            top: '-100%',
            bottom: '-100%',
            left: '-100%',
            right: '-100%'
        },
    })
);

const HomeTrendingNewsArticle = (props: IProps) => {
    const classes = useStyles();
    const maxStringLength = 400;

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
            {
                props.newsArticle.image &&
                <div className={classes.imageContainer}>
                    <img
                        className={classes.image}
                        src={props.newsArticle.image}
                        alt={props.newsArticle.title} />
                </div>
            }
            </Grid>
            <Grid item xs={12} md={8}>
                <Typography gutterBottom variant='h4' color='textPrimary'>
                    <Box fontWeight='fontWeightBold'>
                        {props.newsArticle.title}
                    </Box>
                </Typography>
                <Typography gutterBottom variant='subtitle1' color='textSecondary'>
                    <Box fontWeight='fontWeightBold' fontStyle='italic'>
                        Source: {props.newsArticle.source}
                    </Box>
                </Typography>
                <Typography variant='subtitle1' color='textSecondary'>
                    {props.newsArticle.description.substring(0, maxStringLength)}
                    {
                        props.newsArticle.description.length > maxStringLength ? '...' : null
                    }
                </Typography>
            </Grid>
        </Grid>
    );
};

export default HomeTrendingNewsArticle;
