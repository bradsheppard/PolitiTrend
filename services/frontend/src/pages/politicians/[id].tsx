import * as React from 'react'
import { Grid, Theme, Typography } from '@material-ui/core'
import { NextPage, NextPageContext } from 'next'
import ContentContainer from '../../components/common/ContentContainer'
import PoliticianApi from '../../apis/PoliticianApi'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import PoliticianWordCloudApi from '../../apis/PoliticianWordCloudApi'
import PoliticianSentimentApi from '../../apis/PoliticianSentimentApi'
import dynamic from 'next/dynamic'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        profile: {
            marginTop: theme.spacing(4),
            textAlign: 'center',
        },
        content: {
            paddingLeft: theme.spacing(8),
            paddingRight: theme.spacing(8),
        },
        feed: {
            marginLeft: theme.spacing(4),
            marginRight: theme.spacing(4),
        },
    })
)

interface Politician {
    id: number
    name: string
    party: string
    sentiment: number
    role: string
}

interface WordCount {
    word: string
    count: number
}

interface Sentiment {
    politician: number
    dateTime: string
    sentiment: number
}

interface Props {
    politician: Politician | null
    wordCount: WordCount[]
    sentiments: Sentiment[]
}

const DynamicPoliticianheader = dynamic(() => import('../../components/politician/PoliticianTop'))
const DynamicPoliticianFeed = dynamic(() => import('../../components/politician/PoliticianFeed'))

const PoliticianPage: NextPage<Props> = (props: Props) => {
    if (!props.politician) return <Typography>Not Found</Typography>

    const { politician } = props
    const classes = useStyles()

    return (
        <React.Fragment>
            <ContentContainer>
                <Grid container className={classes.profile} direction="row" justify="center">
                    <Grid item sm={12}>
                        <DynamicPoliticianheader politician={politician} />
                    </Grid>
                    <Grid item sm={12} className={classes.content}>
                        <DynamicPoliticianFeed
                            politician={politician}
                            wordCounts={props.wordCount}
                            sentiments={props.sentiments}
                        />
                    </Grid>
                </Grid>
            </ContentContainer>
        </React.Fragment>
    )
}

PoliticianPage.getInitialProps = async function (context: NextPageContext): Promise<Props> {
    const { id } = context.query
    if (typeof id === 'string') {
        const [politicianDto, politicianWordCloudDtos, sentimentDtos] = await Promise.all([
            PoliticianApi.getOne(parseInt(id)),
            PoliticianWordCloudApi.get({ politician: parseInt(id), limit: 1 }),
            PoliticianSentimentApi.getHistoryForPolitician(parseInt(id)),
        ])

        if (politicianDto == null || politicianWordCloudDtos === null || sentimentDtos === null)
            return {
                politician: null,
                wordCount: [],
                sentiments: [],
            }

        const politician: Politician = {
            id: politicianDto.id,
            name: politicianDto.name,
            party: politicianDto.party,
            sentiment: 5,
            role: politicianDto.role,
        }

        return {
            politician,
            wordCount: politicianWordCloudDtos.length > 0 ? politicianWordCloudDtos[0].words : [],
            sentiments: sentimentDtos,
        }
    } else {
        return {
            politician: null,
            wordCount: [],
            sentiments: [],
        }
    }
}

export default PoliticianPage
