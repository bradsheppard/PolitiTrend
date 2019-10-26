import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import * as React from 'react';
import Jumbotron from '../components/Jumbotron';
import Top from '../components/Top';
import Main from '../components/Main';
import Politician from '../model/Politician';
import fetch from 'isomorphic-unfetch';

const styles = () => createStyles({
    root: {
        flexGrow: 1,
    }
});

interface IProps extends WithStyles<typeof styles>{
    topPoliticians: Array<Politician>;
    bottomPoliticians: Array<Politician>;
}

class App extends React.Component<IProps> {

    static async getInitialProps() {
        const res = await fetch('http://politician');
        const politicians = await res.json();

        return {
            topPoliticians: politicians,
            bottomPoliticians: politicians
        };
    }

    public render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Top/>
                <Jumbotron/>
                <Main topPoliticians={this.props.topPoliticians}
                      bottomPoliticians={this.props.bottomPoliticians} />
            </div>
        );
    }
}

export default withStyles(styles)(App);
