import * as React from 'react'
import { NextPage } from 'next'
import PoliticianApi from '../../apis/PoliticianApi'
import ContentContainer from '../../components/common/ContentContainer'
import { Box, Grid, TextField } from '@material-ui/core'
import dynamic from 'next/dynamic'
import { Pagination } from '@material-ui/lab'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { ChangeEvent, useState } from 'react'
import { useRouter } from 'next/router'
import Politician from '../../apis/model/Politician'

interface Props {
    senators: Politician[]
    numPages: number
    page: number
}

const useStyles = makeStyles((theme) =>
    createStyles({
        paginationContainer: {
            textAlign: 'center',
        },
        pagination: {
            display: 'inline-block',
        },
        search: {
            width: '100%',
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
        },
    })
)

const DynamicPoliticianGridList = dynamic(
    () => import('../../components/politicians/PoliticiansGridList')
)

const Senators: NextPage<Props> = (props: Props) => {
    const classes = useStyles()
    const router = useRouter()

    const [input, setInput] = useState('')

    const handleChangePage = (event: ChangeEvent<unknown> | null, newPage: number) => {
        event?.preventDefault()
        router.push(`/politicians/senators?page=${newPage}`)
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        router.push(`/politicians/senators?name=${input}`)
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInput(event.target.value)
    }

    return (
        <React.Fragment>
            <ContentContainer>
                <Grid container>
                    <Grid item sm={12}>
                        <Grid container alignItems="center" justify="center">
                            <Grid item sm={12}>
                                <form onSubmit={onSubmit}>
                                    <TextField
                                        className={classes.search}
                                        label="Name"
                                        variant="outlined"
                                        onChange={onChange}
                                    />
                                </form>
                            </Grid>
                        </Grid>
                        <DynamicPoliticianGridList title="SENATORS" politicians={props.senators} />
                        <Box className={classes.paginationContainer} mt={6} mb={6}>
                            <Pagination
                                count={props.numPages}
                                size="large"
                                page={props.page}
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
    const nameQuery = query['name']

    let page = 1
    let responseDto

    if (pageQuery) page = parseInt(parseQueryParam(pageQuery))

    if (nameQuery) {
        responseDto = await PoliticianApi.getSenatorsByName(
            parseQueryParam(nameQuery),
            10,
            (page - 1) * 10
        )
    } else {
        responseDto = await PoliticianApi.getSenators(10, (page - 1) * 10)
    }

    const numPages = Math.ceil(responseDto.meta.count / 10.0)
    return {
        senators: responseDto.data,
        numPages,
        page,
    }
}

function parseQueryParam(param: string | string[]) {
    if (Array.isArray(param)) return param[0]
    return param
}

export default Senators
