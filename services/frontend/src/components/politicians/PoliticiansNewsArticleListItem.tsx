import * as React from 'react'
import { Box, Link as MuiLink, Typography } from '@material-ui/core'

interface IProps {
    newsArticle: NewsArticle
}

interface NewsArticle {
    title: string
    url: string
}

const PoliticiansNewsArticleListItem: React.FC<IProps> = (props: IProps) => {
    return (
        <MuiLink href={props.newsArticle.url} underline="none">
            <div>
                <Typography gutterBottom variant="h6" color="textPrimary">
                    <Box fontWeight="fontWeightBold">{props.newsArticle.title}</Box>
                </Typography>
            </div>
        </MuiLink>
    )
}

export default PoliticiansNewsArticleListItem
