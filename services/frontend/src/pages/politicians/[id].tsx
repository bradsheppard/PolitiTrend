import * as React from 'react';
import { createStyles, Grid, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import { NextPageContext } from 'next';
import ContentContainer from '../../components/common/ContentContainer';
import PoliticianApi from '../../apis/politician/PoliticianApi';
import Bar from '../../components/bar/Bar';
import PoliticianDto from '../../apis/politician/PoliticianDto';
import OpinionSummaryDto from '../../apis/opinion-summary/OpinionSummaryDto';
import OpinionSummaryApi from '../../apis/opinion-summary/OpinionSummaryApi';
import PoliticianHeader from '../../components/politician/PoliticianHeader';
import PoliticianFeed from '../../components/politician/PoliticianFeed';

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
            <Bar/>
            <ContentContainer>
                <Grid container
                      className={classes.profile}
                      direction='row'
                      justify='center'>
                    <Grid item sm={4}>
                        <PoliticianHeader politician={politician}/>
                    </Grid>
                    <Grid item sm={8} className={classes.content}>
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
        const opinionSummaryDtos: OpinionSummaryDto[] = await OpinionSummaryApi.get({ politician: parseInt(id) });
        opinionSummaryDtos.sort((a, b) => b.id - a.id);

        if(!politicianDto)
            return {
                politician: null
            };

        const politician: Politician = {
            id: politicianDto.id,
            name: politicianDto.name,
            party: politicianDto.party,
            sentiment: opinionSummaryDtos.length > 0 ? opinionSummaryDtos[0].sentiment : 5,
            sentimentHistory: opinionSummaryDtos
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
