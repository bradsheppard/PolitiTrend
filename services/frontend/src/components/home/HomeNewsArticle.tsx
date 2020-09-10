import * as React from 'react';
import {
    Avatar,
    Box, Link as MuiLink,
    Typography
} from '@material-ui/core';
import { toDate } from '../../utils/StringUtils';
import { AvatarGroup } from '@material-ui/lab';
import { politicianNameToImagePath } from '../../utils/ImagePath';

interface NewsArticle {
    image: string;
    summary: string;
    url: string;
    source: string;
    dateTime: string;
    politicians: Politician[]
}

interface Politician {
    name: string;
    party: string;
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
                <AvatarGroup max={4}>
                    {
                        props.newsArticle.politicians.map((politician, index) =>
                            <Avatar alt={politician.name} src={politicianNameToImagePath(politician.name)} key={index} />
                        )
                    }
                </AvatarGroup>
            </div>
        </MuiLink>
    );
};

export default HomeNewsArticle;
