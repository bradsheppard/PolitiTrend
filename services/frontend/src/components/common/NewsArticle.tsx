import * as React from 'react';
import Card from './Card';
import { CardContent, CardMedia, Link as MuiLink, makeStyles, Typography } from '@material-ui/core';
import { red } from '@material-ui/core/colors';

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

const useStyles = makeStyles({
    media: {
        height: 250
    },
    avatar: {
        backgroundColor: red[500],
    },
});

const NewsArticle = (props: IProps) => {
    const classes = useStyles();

    return (
        <MuiLink href={props.newsArticle.url} underline='none'>
            <Card>
                {
                    props.newsArticle.image &&
                    <CardMedia
                        className={classes.media}
                        image={props.newsArticle.image}
                        title={props.newsArticle.title} />
                }
                <CardContent>
                    <Typography gutterBottom variant='h6'>
                        {props.newsArticle.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {props.newsArticle.description}
                    </Typography>
                </CardContent>
            </Card>
        </MuiLink>
    );
};

export default NewsArticle;
