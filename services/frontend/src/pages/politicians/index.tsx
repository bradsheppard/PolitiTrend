import * as React from 'react'
import PoliticianApi from '../../apis/PoliticianApi'
import {
    createStyles,
    Grid,
    Link as MuiLink,
    Typography,
    withStyles,
    WithStyles,
} from '@material-ui/core'
import ContentContainer from '../../components/common/ContentContainer'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const style = () =>
    createStyles({
        more: {
            float: 'right',
        },
    })

interface Politician {
    id: number
    name: string
    party: string
    role: string
}

interface Props extends WithStyles<typeof style> {
    politicians: Politician[]
}

const DynamicPoliticianGridList = dynamic(
    () => import('../../components/politicians/PoliticiansGridList')
)

interface MoreProps {
    link: string
    className: string
}

const MoreLink = (props: MoreProps) => {
    return (
        <div className={props.className}>
            <Link href={props.link} passHref>
                <MuiLink>
                    <Typography variant="h5" color="primary">
                        MORE...
                    </Typography>
                </MuiLink>
            </Link>
        </div>
    )
}

class Index extends React.Component<Props> {
    static async getInitialProps() {
        const politicians = await PoliticianApi.get()

        return {
            politicians,
        }
    }

    render() {
        const { classes } = this.props

        const senators = this.props.politicians.filter((x) => x.role === 'Senator').slice(0, 6)
        const presidents = this.props.politicians.filter(
            (x) =>
                x.role === 'President' ||
                x.role === 'Presidential Candidate' ||
                x.role === 'Former President'
        )
        const congressmembers = this.props.politicians
            .filter((x) => x.role === 'Congressman')
            .slice(0, 6)

        return (
            <React.Fragment>
                <ContentContainer>
                    <Grid container>
                        <Grid item sm={12}>
                            <DynamicPoliticianGridList
                                politicians={presidents}
                                title="PRESIDENTS"
                            />
                            <DynamicPoliticianGridList politicians={senators} title="SENATORS" />
                            <MoreLink link="/senators" className={classes.more} />
                            <DynamicPoliticianGridList
                                politicians={congressmembers}
                                title="CONGRESS MEMBERS"
                            />
                            <MoreLink link="/congressmembers" className={classes.more} />
                        </Grid>
                    </Grid>
                </ContentContainer>
            </React.Fragment>
        )
    }
}

export default withStyles(style)(Index)
