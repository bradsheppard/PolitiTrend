import * as React from 'react'
import PoliticiansNewsArticleListItem from './PoliticiansNewsArticleListItem'
import { Box, createStyles, Divider, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import ThickDivider from '../../components/common/Divider'

interface IProps {
    newsArticles: NewsArticle[]
}

interface NewsArticle {
    title: string
    description: string
    url: string
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        newsArticleContainer: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
        header: {
            paddingBottom: theme.spacing(2),
        },
    })
)

const PoliticiansNewsArticleList: React.FC<IProps> = (props: IProps) => {
    const classes = useStyles()

    return (
        <React.Fragment>
            <Typography variant="h4" color="textPrimary" className={classes.header}>
                <Box fontWeight="fontWeightBold">Trending</Box>
            </Typography>
            <ThickDivider />
            {props.newsArticles.map((newsArticle: NewsArticle, index: number) => {
                return (
                    <div key={index}>
                        <div className={classes.newsArticleContainer}>
                            <PoliticiansNewsArticleListItem newsArticle={newsArticle} key={index} />
                        </div>
                        <Divider />
                    </div>
                )
            })}
        </React.Fragment>
    )
}

export default PoliticiansNewsArticleList
