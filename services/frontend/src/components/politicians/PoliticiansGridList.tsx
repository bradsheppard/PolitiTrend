import * as React from 'react'
import { createStyles, Grid, Theme, Link as MuiLink, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Link from 'next/link'
import Header from '../common/Header'
import dynamic from 'next/dynamic'

interface Props {
    politicians: Politician[]
    title: string
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

const DynamicPoliticianGridListItem = dynamic(() => import('./PoliticiansGridListItem'))

const PoliticiansGridList: React.FC<Props> = (props: Props) => {
    const classes = useStyles()

    return (
        <React.Fragment>
            <Grid container>
                <Grid item xs={12}>
                    {RoleHeader(props.title)}
                </Grid>
                {props.politicians.map((politician: Politician, index: number) => {
                    return (
                        <Grid item xs={12} md={6} key={index}>
                            <Link
                                href="/politicians/[id]"
                                passHref
                                as={`/politicians/${politician.id}`}
                            >
                                <MuiLink>
                                    <DynamicPoliticianGridListItem
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
