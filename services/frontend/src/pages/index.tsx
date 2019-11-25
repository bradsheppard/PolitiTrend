import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import * as React from 'react';
import Jumbotron from '../components/Jumbotron';
import Main from '../components/Main';
import Politician from '../model/Politician';
import PoliticianApi from '../model/PoliticianApi';
import { NextPageContext } from 'next';
import OpinionApi from '../model/OpinionApi';
import PoliticianOpinions from '../model/PoliticianOpinions';
import Opinion from '../model/Opinion';

const styles = () => createStyles({
    root: {
        flexGrow: 1,
    }
});

interface IProps extends WithStyles<typeof styles>{
    topPoliticians: Array<PoliticianOpinions>;
    bottomPoliticians: Array<PoliticianOpinions>;
}

class App extends React.Component<IProps> {

    static async getInitialProps(context: NextPageContext) {
        const [ politicians, opinions ] = await Promise.all([
            PoliticianApi.get(context),
            OpinionApi.get(context)
        ]);

        const opinionsMap: Map<number, Array<Opinion>> = new Map();
        opinions.forEach((opinion: Opinion) => {
            const entry = opinionsMap.get(opinion.politician);
            if(entry) {
                entry.push(opinion);
                opinionsMap.set(opinion.politician, entry);
            }
            else {
                opinionsMap.set(opinion.politician, [opinion]);
            }
        });

        const politicianOpinions: Array<PoliticianOpinions> = [];
        politicians.forEach((politician: Politician) => {
            const opinions = opinionsMap.get(politician.id);
            politicianOpinions.push({
                politician,
                opinions: opinions ? opinions : []
            });
        });

        return {
            topPoliticians: politicianOpinions.slice(0, 5),
            bottomPoliticians: politicianOpinions.slice(55, 60)
        };
    }

    public render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Jumbotron/>
                <Main topPoliticians={this.props.topPoliticians}
                      bottomPoliticians={this.props.bottomPoliticians} />
            </div>
        );
    }
}

export default withStyles(styles)(App);
