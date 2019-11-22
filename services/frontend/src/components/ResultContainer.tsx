import * as React from 'react';
import { Grid } from '@material-ui/core';

class ResultContainer extends React.Component {

    render() {
        return (
            <Grid container
                  alignItems='center'
                  direction='row'
                  justify='center'>
                <Grid item sm={10}>
                    <Grid container
                          alignItems='center'
                          direction='row'
                          justify='center'>
                        <Grid item sm={10}>
                            {this.props.children}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default ResultContainer;