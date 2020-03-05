import * as React from 'react';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Link as MuiLink,
    makeStyles,
    Typography
} from '@material-ui/core';
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
    height?: number;
}

const useStyles = makeStyles({
    media: (props: IProps) => ({
        height: props.height ? props.height : 250
    }),
    avatar: {
        backgroundColor: red[500],
    },
    card: {
        background: 'none'
    }
});

const HomeNewsArticle = (props: IProps) => {
    const classes = useStyles(props);


    return (
        <MuiLink href={props.newsArticle.url} underline='none'>
            <Card elevation={0} className={classes.card}>
                <CardContent>
                    <Typography gutterBottom variant='h3'>
                        <Box fontWeight='fontWeightBold'>
                            {props.newsArticle.title}
                        </Box>
                    </Typography>
                    <Typography variant='subtitle1' color='textSecondary' component="p">
                        {props.newsArticle.description}
                    </Typography>
                </CardContent>
                {
                    props.newsArticle.image &&
                    <CardMedia
                        className={classes.media}
                        image={props.newsArticle.image}
                        title={props.newsArticle.title} />
                }
            </Card>
        </MuiLink>
    );
};

export default HomeNewsArticle;
