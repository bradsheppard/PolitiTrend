import * as React from 'react';
import { Box, createStyles, Link as MuiLink, makeStyles, Theme, Typography } from '@material-ui/core';

interface PoliticianNewsArticle {
    image: string;
    title: string;
    url: string;
    source: string;
    description: string;
}

interface IProps {
    newsArticle: PoliticianNewsArticle;
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

const NewsArticle = (props: IProps) => {
    const classes = useStyles(props);

    return (
        <MuiLink href={props.newsArticle.url} underline='none'>
            <div>
                <Typography color='textPrimary' gutterBottom variant='h3'>
                    <Box fontWeight='fontWeightBold'>
                        {props.newsArticle.title}
                    </Box>
                </Typography>
                <Typography className={classes.subtitle} variant='subtitle1' color="textSecondary">
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

export default NewsArticle;
