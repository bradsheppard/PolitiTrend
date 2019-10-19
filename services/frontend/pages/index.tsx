import { createStyles, withStyles, WithStyles } from "@material-ui/core";
import * as React from 'react';
import Jumbotron from '../components/Jumbotron';
import Top from '../components/Top';
import Main from '../components/Main';
import testLegislators from '../mocks/TestLegislators';

const styles = () => createStyles({
    root: {
        flexGrow: 1,
    }
});

interface IProps extends WithStyles<typeof styles> {}

class App extends React.Component<IProps> {
    public render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Top/>
                <Jumbotron/>
                <Main legislators={testLegislators} />
            </div>
        );
    }
}

export default withStyles(styles)(App);
