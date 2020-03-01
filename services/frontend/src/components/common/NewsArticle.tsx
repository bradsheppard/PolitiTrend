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
        height: 140
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
                    Lizard
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                    across all continents except Antarctica
                </Typography>
            </CardContent>
        </Card>
    );
};

export default NewsArticle;
