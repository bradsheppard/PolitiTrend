import * as React from 'react'
import { createStyles, Grid, Theme, Typography } from '@material-ui/core'
import { NextPage, NextPageContext } from 'next'
import ContentContainer from '../../components/common/ContentContainer'
import PoliticianApi from '../../apis/politician/PoliticianApi'
import PoliticianHeader from '../../components/politician/PoliticianHeader'
import PoliticianFeed from '../../components/politician/PoliticianFeed'
import { makeStyles } from '@material-ui/styles'

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
}

interface IProps {
    politician: Politician | null
}

const PoliticianPage: NextPage<IProps> = (props: IProps) => {
    if (!props.politician) return <Typography>Not Found</Typography>

    const { politician } = props
    const classes = useStyles()

    return (
        <React.Fragment>
            <ContentContainer>
                <Grid container className={classes.profile} direction="row" justify="center">
                    <Grid item sm={3}>
                        <PoliticianHeader politician={politician} />
                    </Grid>
                    <Grid item sm={9} className={classes.content}>
                        <PoliticianFeed politician={politician.id} />
                    </Grid>
                </Grid>
            </ContentContainer>
        </React.Fragment>
    )
}

PoliticianPage.getInitialProps = async function (context: NextPageContext): Promise<IProps> {
    const { id } = context.query
    if (typeof id === 'string') {
        const [politicianDto] = await Promise.all([PoliticianApi.getOne(id)])

        if (!politicianDto)
            return {
                politician: null,
            }

        const politician: Politician = {
            id: politicianDto.id,
            name: politicianDto.name,
            party: politicianDto.party,
            sentiment: 5,
        }

        return {
            politician,
        }
    } else {
        return {
            politician: null,
        }
    }
}

export default PoliticianPage
