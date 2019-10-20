import * as React from 'react';
import Legislator from '../model/Legislator';
import { Grid } from '@material-ui/core';
import Result from './Result';

interface IProps {
    topLegislators: Array<Legislator>;
    bottomLegislators: Array<Legislator>;
}

class Main extends React.Component<IProps> {
    render() {
        return (
            <Grid container
                  alignItems='center'
                  direction='row'
                  justify='center'>
                <Grid item sm={8}>
                    <Grid container
                          alignItems='center'
                          direction='row'
                          justify='center'
                    >
                        <Grid item sm={6}>
                            {
                                this.props.topLegislators.map((legislator: Legislator, index) => {
                                    return (
                                        <Result legislator={legislator} key={index}/>
                                    )
                                })
                            }
                        </Grid>
                        <Grid item sm={6}>
                            {
                                this.props.bottomLegislators.map((legislator: Legislator, index) => {
                                    return (
                                        <Result legislator={legislator} key={index}/>
                                    )
                                })
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default Main;
