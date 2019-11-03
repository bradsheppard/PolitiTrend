import * as React from 'react';
import Politician from '../model/Politician';
import { Grid } from '@material-ui/core';
import Result from './Result';
import ResultContainer from './ResultContainer';
import ResultHeader from './ResultHeader';

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
                        <ResultHeader>
                            Most Liked
                        </ResultHeader>
                        {
                            this.props.topPoliticians.map((Politician: Politician, index) => {
                                return (
                                    <Result politician={Politician} key={index}/>
                                )
                            })
                        }
                    </Grid>
                    <Grid item sm={6}>
                        <ResultHeader>
                            Most Hated
                        </ResultHeader>
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
