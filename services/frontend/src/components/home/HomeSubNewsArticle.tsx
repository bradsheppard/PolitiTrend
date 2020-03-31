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
            maxWidth: '100%',
            margin: 'auto',
            display: 'block'
        },
        subtitle: {
            paddingBottom: theme.spacing(3)
        },
        header: {
            paddingTop: theme.spacing(2)
        }
    })
);

const HomeSubNewsArticle = (props: IProps) => {
    const classes = useStyles(props);

    return (
        <MuiLink href={props.newsArticle.url} underline='none'>
            <div>
                <Typography gutterBottom variant='h5' color='textPrimary' className={classes.header}>
                    <Box fontWeight='fontWeightBold'>
                        {props.newsArticle.title}
                    </Box>
                </Typography>
                <Typography variant='subtitle1' color='textSecondary' className={classes.subtitle}>
                    {props.newsArticle.description}
                </Typography>
                {
                    props.newsArticle.image &&
                    <img
                        className={classes.image}
                        src={props.newsArticle.image}
                        alt={props.newsArticle.title} />
                }
            </div>
        </MuiLink>
    );
};

export default HomeSubNewsArticle;
