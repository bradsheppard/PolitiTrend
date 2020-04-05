import * as React from 'react';
import PoliticianGridListItem from './PoliticianGridListItem';
import { createStyles, Grid, Theme, Link as MuiLink } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Link from 'next/link';

interface IProps {
    politicians: Politician[];
}

interface Politician {
    id: number;
    name: string;
    party: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2)
        }
    })
);

const PoliticianGridList = (props: IProps) => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Grid container>
            {
                props.politicians.map((politician: Politician, index: number) => {
                    return (
                        <Grid item xs={6}>
                            <Link href='/politicians/[id]' as={`/politicians/${politician.id}`}>
                                <MuiLink href='#'>
                                    <PoliticianGridListItem politician={politician} key={index} className={classes.container} />
                                </MuiLink>
                            </Link>
                        </Grid>
                    );
                })
            }
            </Grid>
        </React.Fragment>
    );
};

export default PoliticianGridList;
