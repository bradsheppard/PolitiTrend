import * as React from 'react';
import {
    Box, Link as MuiLink,
    Typography
} from '@material-ui/core';
import { toDate } from '../../utils/StringUtils';

interface NewsArticle {
    image: string;
    summary: string;
    url: string;
    source: string;
    dateTime: string;
}

interface IProps {
    newsArticle: NewsArticle;
    height?: number;
}

const capitalize = (inputString: string) => {
    return inputString.replace(/\b\w/g, l => l.toUpperCase())
}

const HomeNewsArticle = (props: IProps) => {
    return (
        <MuiLink href={props.newsArticle.url} underline='none'>
            <div>
                <Typography gutterBottom variant='h4' color='textPrimary'>
                    <Box fontWeight='fontWeightBold'>
                        {capitalize(props.newsArticle.summary)}
                    </Box>
                </Typography>
                <Typography gutterBottom variant='subtitle1' color='textSecondary'>
                    <Box fontWeight='fontWeightBold' fontStyle='italic'>
                        {toDate(props.newsArticle.dateTime)}
                    </Box>
                </Typography>
                <Typography gutterBottom variant='subtitle1' color='textSecondary'>
                    <Box fontWeight='fontWeightBold' fontStyle='italic'>
                        Source: {props.newsArticle.source}
                    </Box>
                </Typography>
            </div>
        </MuiLink>
    );
};

export default HomeNewsArticle;
