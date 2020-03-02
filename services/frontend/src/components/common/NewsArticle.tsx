import * as React from 'react';
import Card from './Card';
import { CardContent, CardMedia, Link as MuiLink, makeStyles, Typography } from '@material-ui/core';

interface NewsArticle {
    image: string;
    title: string;
    url: string;
}

interface IProps {
    newsArticle: NewsArticle;
}

const useStyles = makeStyles({
    media: {
        height: 250
    }
});

const NewsArticle = (props: IProps) => {
    const classes = useStyles();

    return (
        <Card>
            {
                props.newsArticle.image &&
                <CardMedia
                    className={classes.media}
                    image={props.newsArticle.image}
                    title={props.newsArticle.title} />
            }
            <CardContent>
                <MuiLink href={props.newsArticle.url} underline='none'>
                    <Typography variant='h6'>
                        {props.newsArticle.title}
                    </Typography>
                </MuiLink>
            </CardContent>
        </Card>
    );
};

export default NewsArticle;
