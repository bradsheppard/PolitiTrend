import * as React from 'react';
import Politician from '../model/Politician';
import { Grid } from '@material-ui/core';
import Result from './Result';
import ResultContainer from './ResultContainer';

interface IProps {
    topPoliticians: Array<Politician>;
    bottomPoliticians: Array<Politician>;
}

class Main extends React.Component<IProps> {
    render() {
        return (
            <ResultContainer>
                <Grid container
                      alignItems='center'
                      direction='row'
                      justify='center'>
                    <Grid item sm={6}>
                        {
                            this.props.topPoliticians.map((Politician: Politician, index) => {
                                return (
                                    <Result politician={Politician} key={index}/>
                                )
                            })
                        }
                    </Grid>
                    <Grid item sm={6}>
                        {
                            this.props.bottomPoliticians.map((Politician: Politician, index) => {
                                return (
                                    <Result politician={Politician} key={index}/>
                                )
                            })
                        }
                    </Grid>
                </Grid>
            </ResultContainer>
        );
    }
}

export default Main;
