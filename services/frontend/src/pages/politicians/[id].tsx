import * as React from 'react';
import { createStyles, Grid, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import { NextPageContext } from 'next';
import ContentContainer from '../../components/common/ContentContainer';
import PoliticianApi from '../../apis/politician/PoliticianApi';
import Bar from '../../components/bar/Bar';
import PoliticianDto from '../../apis/politician/PoliticianDto';
import PoliticianHeader from '../../components/politician/PoliticianHeader';
import PoliticianFeed from '../../components/politician/PoliticianFeed';
import TransparentJumbo from '../../components/common/TransparentJumbo';

const styles = (theme: Theme) => createStyles({
    profile: {
        marginTop: theme.spacing(4),
        textAlign: 'center'
    },
    content: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4)
    },
});

interface OpinionSummary {
    sentiment: number;
    dateTime: string;
}

interface Politician {
    id: number;
    name: string;
    party: string;
    sentiment: number;
    sentimentHistory: OpinionSummary[];
}

interface IProps extends WithStyles<typeof styles> {
    politician: Politician | null;
}

const PoliticianPage = (props: IProps) => {
    if(!props.politician)
        return (
            <Typography>Not Found</Typography>
        );

    const { politician, classes } = props;

    return (
        <React.Fragment>
            <Bar overlay/>
            <TransparentJumbo />
            <ContentContainer>
                <Grid container
                      className={classes.profile}
                      direction='row'
                      justify='center'>
                    <Grid item sm={3}>
                        <PoliticianHeader politician={politician}/>
                    </Grid>
                    <Grid item sm={9} className={classes.content}>
                        <PoliticianFeed politician={politician.id} />
                    </Grid>
                </Grid>
            </ContentContainer>
        </React.Fragment>
    )
};

PoliticianPage.getInitialProps = async function(context: NextPageContext) {
    const { id } = context.query;
    if (typeof id === 'string') {
        const politicianDto: PoliticianDto | null = await PoliticianApi.getOne(parseInt(id));

        if(!politicianDto)
            return {
                politician: null
            };

        const politician: Politician = {
            id: politicianDto.id,
            name: politicianDto.name,
            party: politicianDto.party,
            sentiment: 5,
            sentimentHistory: []
        };

        return {
            politician
        };
    }
    else {
        return {
            politician: null
        }
    }
};

export default withStyles(styles)(PoliticianPage);
