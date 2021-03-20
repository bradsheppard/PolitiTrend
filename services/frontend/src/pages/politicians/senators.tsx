import * as React from 'react'
import { NextPage } from 'next'
import PoliticianApi from '../../apis/PoliticianApi'
import ContentContainer from '../../components/common/ContentContainer'
import { Box, Grid } from '@material-ui/core'
import dynamic from 'next/dynamic'
import { Pagination } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'
import { ChangeEvent } from 'react'
import { useRouter } from 'next/router'
import Politician from '../../apis/model/Politician'

interface Props {
    senators: Politician[]
    numPages: number
}

const useStyles = makeStyles({
    paginationContainer: {
        textAlign: 'center',
    },
    pagination: {
        display: 'inline-block',
    },
})

const DynamicPoliticianGridList = dynamic(
    () => import('../../components/politicians/PoliticiansGridList')
)

const Senators: NextPage<Props> = (props: Props) => {
    const classes = useStyles()
    const router = useRouter()

    const handleChangePage = (event: ChangeEvent<unknown> | null, newPage: number) => {
        event?.preventDefault()
        router.push(`/senators?page=${newPage}`)
    }

    return (
        <React.Fragment>
            <ContentContainer>
                <Grid container>
                    <Grid item sm={12}>
                        <DynamicPoliticianGridList title="SENATORS" politicians={props.senators} />
                        <Box className={classes.paginationContainer} mt={6} mb={6}>
                            <Pagination
                                count={props.numPages}
                                size="large"
                                className={classes.pagination}
                                onChange={handleChangePage}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </ContentContainer>
        </React.Fragment>
    )
}

Senators.getInitialProps = async ({ query }): Promise<Props> => {
    const pageQuery = query['page']
    let page = 1

    if (pageQuery && Array.isArray(pageQuery)) page = parseInt(pageQuery[0])
    else if (pageQuery) page = parseInt(pageQuery)

    const responseDto = await PoliticianApi.getSenators(10, (page - 1) * 10)
    const numPages = Math.ceil(responseDto.meta.count / 10.0)
    return {
        senators: responseDto.data,
        numPages,
    }
}

export default Senators
