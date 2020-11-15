import * as React from 'react'
import PoliticiansGridListItem from './PoliticiansGridListItem'
import { createStyles, Grid, Theme, Link as MuiLink, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Link from 'next/link'
import Header from '../common/Header'

interface IProps {
    politicians: Politician[]
}

interface Politician {
    id: number
    name: string
    party: string
    role: string
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
    })
)

const RoleHeader = (title: string) => {
    return (
        <Box pb="2em">
            <Header>{title}</Header>
        </Box>
    )
}

const PoliticiansGridList: React.FC<IProps> = (props: IProps) => {
    const classes = useStyles()
    const senators = props.politicians.filter((x) => x.role === 'Senator')
    const presidents = props.politicians.filter(
        (x) => x.role === 'President' || x.role === 'Presidential Candidate'
    )

    return (
        <React.Fragment>
            <Grid container>
                <Grid item xs={12}>
                    {RoleHeader('Presidents')}
                </Grid>
                {presidents.map((politician: Politician, index: number) => {
                    return (
                        <Grid item xs={12} md={6} key={index}>
                            <Link
                                href="/politicians/[id]"
                                passHref
                                as={`/politicians/${politician.id}`}
                            >
                                <MuiLink>
                                    <PoliticiansGridListItem
                                        politician={politician}
                                        key={index}
                                        className={classes.container}
                                    />
                                </MuiLink>
                            </Link>
                        </Grid>
                    )
                })}
            </Grid>
            <Grid container>
                <Grid item xs={12}>
                    {RoleHeader('Senators')}
                </Grid>
                {senators.map((politician: Politician, index: number) => {
                    return (
                        <Grid item xs={12} md={6} key={index}>
                            <Link
                                href="/politicians/[id]"
                                passHref
                                as={`/politicians/${politician.id}`}
                            >
                                <MuiLink>
                                    <PoliticiansGridListItem
                                        politician={politician}
                                        key={index}
                                        className={classes.container}
                                    />
                                </MuiLink>
                            </Link>
                        </Grid>
                    )
                })}
            </Grid>
        </React.Fragment>
    )
}

export default PoliticiansGridList
