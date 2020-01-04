import { createStyles, Grid, withStyles, WithStyles } from '@material-ui/core';
import * as React from 'react';
import Jumbotron from '../components/Jumbotron';
import PoliticianApi from '../model/PoliticianApi';
import { NextPageContext } from 'next';
import CategoryHeader from '../components/CategoryHeader';
import PoliticianSentimentSummary from '../components/PoliticianSentimentSummary';
import ContentContainer from '../components/ContentContainer';
import Politician from '../model/Politician';

const styles = () => createStyles({
    root: {
        flexGrow: 1,
    }
});

interface IProps extends WithStyles<typeof styles>{
    topPoliticians: Politician[];
    bottomPoliticians: Politician[];
}

class App extends React.Component<IProps> {

    static async getInitialProps(context: NextPageContext) {
        let politicians: Politician[] = await PoliticianApi.get(context);
        politicians = politicians.sort((a, b) => b.sentiment - a.sentiment);

        return {
            topPoliticians: politicians.slice(0, 5),
            bottomPoliticians: politicians.slice(politicians.length - 5, politicians.length)
        };
    }

    public render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Jumbotron/>
                <ContentContainer>
                    <Grid container
                          direction='row'
                          justify='center'>
                        <Grid item sm={6}>
                            <CategoryHeader>
                                Most Liked
                            </CategoryHeader>
                            {
                                this.props.topPoliticians.map((politician: Politician, index) => {
                                    return (
                                        <PoliticianSentimentSummary politician={politician} key={index}/>
                                    )
                                })
                            }
                        </Grid>
                        <Grid item sm={6}>
                            <CategoryHeader>
                                Most Hated
                            </CategoryHeader>
                            {
                                this.props.bottomPoliticians.map((politician: Politician, index) => {
                                    return (
                                        <PoliticianSentimentSummary politician={politician} key={index}/>
                                    )
                                })
                            }
                        </Grid>
                    </Grid>
                </ContentContainer>
            </div>
        );
    }
}

export default withStyles(styles)(App);
