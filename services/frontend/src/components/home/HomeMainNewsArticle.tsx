import * as React from 'react';
import {
    Box, createStyles,
    Link as MuiLink,
    makeStyles, Theme,
    Typography
} from '@material-ui/core';

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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        image: {
            maxWidth: '100%',
            margin: 'auto',
            display: 'block'
        },
        subtitle: {
            paddingBottom: theme.spacing(3)
        }
    })
);

const HomeMainNewsArticle = (props: IProps) => {
    const classes = useStyles(props);

    return (
        <MuiLink href={props.newsArticle.url} underline='none'>
            <div>
                <Typography gutterBottom variant='h3' color='textPrimary'>
                    <Box fontWeight='fontWeightBold'>
                        {props.newsArticle.title}
                    </Box>
                </Typography>
                <Typography gutterBottom variant='subtitle1' color='textSecondary'>
                    <Box fontWeight='fontWeightBold' fontStyle='italic'>
                        Source: {props.newsArticle.source}
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

export default HomeMainNewsArticle;
