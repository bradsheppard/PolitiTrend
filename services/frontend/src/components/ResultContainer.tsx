import * as React from 'react';
import { Grid, Paper } from '@material-ui/core';

class ResultContainer extends React.Component {

    render() {
        return (
            <Grid container
                  alignItems='center'
                  direction='row'
                  justify='center'>
                <Grid item sm={10}>
                    <Paper elevation={15}>
                        <Grid container
                              alignItems='center'
                              direction='row'
                              justify='center'>
                            <Grid item sm={10}>
                                {this.props.children}
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

export default ResultContainer;