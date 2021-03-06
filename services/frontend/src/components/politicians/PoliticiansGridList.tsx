import * as React from 'react'
import { Grid, Theme, Link as MuiLink, Box } from '@material-ui/core'
import { makeStyles, createStyles, withStyles } from '@material-ui/core/styles'
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
            <Header textVariant="h4">{title}</Header>
        </Box>
    )
}

const ThickLink = withStyles({
    root: {
        '&:hover': { textDecorationThickness: '3px' },
    },
})(MuiLink)

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
                                <ThickLink>
                                    <DynamicPoliticianGridListItem
                                        politician={politician}
                                        key={index}
                                        className={classes.container}
                                    />
                                </ThickLink>
                            </Link>
                        </Grid>
                    )
                })}
            </Grid>
        </React.Fragment>
    )
}

export default PoliticiansGridList
