import * as React from 'react'
import PoliticianApi from '../apis/PoliticianApi'
import ContentContainer from '../components/common/ContentContainer'
import { Grid } from '@material-ui/core'
import dynamic from 'next/dynamic'
import { NextPage } from 'next'

interface Props {
    presidents: Politician[]
}

interface Politician {
    name: string
    party: string
    role: string
    id: number
}

const DynamicPoliticianGridList = dynamic(
    () => import('../components/politicians/PoliticiansGridList')
)

const Presidents: NextPage<Props> = (props: Props) => {
    return (
        <React.Fragment>
            <ContentContainer>
                <Grid container>
                    <Grid item sm={12}>
                        <DynamicPoliticianGridList
                            title="PRESIDENTS"
                            politicians={props.presidents}
                        />
                    </Grid>
                </Grid>
            </ContentContainer>
        </React.Fragment>
    )
}

Presidents.getInitialProps = async (): Promise<Props> => {
    const responseDto = await PoliticianApi.getPresidents()
    return {
        presidents: responseDto.data,
    }
}

export default Presidents
