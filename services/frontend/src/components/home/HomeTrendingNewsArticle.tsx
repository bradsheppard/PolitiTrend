import * as React from 'react';
import { Box, createStyles, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

interface IProps {
    newsArticle: NewsArticle;
}

interface NewsArticle {
    title: string;
    description: string;
    image: string;
    url: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        imageContainer: {
            marginRight: theme.spacing(2),
            position: 'relative',
            overflow: 'hidden',
            height: theme.spacing(40),
            flex: 0.4
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
        textContainer: {
            flex: 0.6
        },
        container: {
            display: 'flex'
        }
    })
);

const HomeTrendingNewsArticle = (props: IProps) => {
    const classes = useStyles();
    const maxStringLength = 400;

    return (
        <div className={classes.container}>
            {
                props.newsArticle.image &&
                <div className={classes.imageContainer}>
                    <img
                        className={classes.image}
                        src={props.newsArticle.image}
                        alt={props.newsArticle.title} />
                </div>
            }
            <div className={classes.textContainer}>
                <Typography gutterBottom variant='h4' color='textPrimary'>
                    <Box fontWeight='fontWeightBold'>
                        {props.newsArticle.title}
                    </Box>
                </Typography>
                <Typography variant='subtitle1' color='textSecondary'>
                    {props.newsArticle.description.substring(0, maxStringLength)}
                    {
                        props.newsArticle.description.length > maxStringLength ? '...' : null
                    }
                </Typography>
            </div>
        </div>
    );
};

export default HomeTrendingNewsArticle;
