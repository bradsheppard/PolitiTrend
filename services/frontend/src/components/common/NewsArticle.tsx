import * as React from 'react';
import Card from './Card';
import { CardContent, CardMedia, makeStyles, Typography } from '@material-ui/core';

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
        height: 200
    }
});

const NewsArticle = (props: IProps) => {
    const classes = useStyles();

    return (
        <Card>
            <CardMedia
                className={classes.media}
                image={props.newsArticle.image}
                title={props.newsArticle.title} />
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {props.newsArticle.title}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default NewsArticle;
