import * as React from 'react';
import { Box, createStyles, Link as MuiLink, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

interface NewsArticle {
    image: string;
    title: string;
    url: string;
    source: string;
    description: string;
}

interface IProps {
    newsArticle: NewsArticle;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        image: {
            position: 'absolute',
            height: '100%',
            margin: 'auto',
            top: '-100%',
            bottom: '-100%',
            left: '-100%',
            right: '-100%'
        },
        imageContainer: {
            position: 'relative',
            overflow: 'hidden',
            height: theme.spacing(40),
            justifyItems: 'center'
        }
    })
);

const HomeLatestNewsArticle = (props: IProps) => {
    const classes = useStyles(props);

    const maxStringLength = 400;

    return (
        <MuiLink href={props.newsArticle.url} underline='none'>
            <div>
                {
                    props.newsArticle.image &&
                        <div className={classes.imageContainer}>
                            <img
                                className={classes.image}
                                src={props.newsArticle.image}
                                alt={props.newsArticle.title} />
                        </div>
                }
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
            </div>
        </MuiLink>
    );
};

export default HomeLatestNewsArticle;
