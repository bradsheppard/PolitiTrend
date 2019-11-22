import * as React from 'react';
import { Grid } from '@material-ui/core';
import Result from './Result';
import ResultContainer from './ResultContainer';
import ResultHeader from './ResultHeader';
import PoliticianOpinions from '../model/PoliticianOpinions';

interface IProps {
    topPoliticians: Array<PoliticianOpinions>;
    bottomPoliticians: Array<PoliticianOpinions>;
}

class Main extends React.Component<IProps> {
    render() {
        return (
            <ResultContainer>
                <Grid container
                      direction='row'
                      justify='center'>
                    <Grid item sm={6}>
                        <ResultHeader>
                            Most Liked
                        </ResultHeader>
                        {
                            this.props.topPoliticians.map((politician: PoliticianOpinions, index) => {
                                return (
                                    <Result politicianOpinions={politician} key={index}/>
                                )
                            })
                        }
                    </Grid>
                    <Grid item sm={6}>
                        <ResultHeader>
                            Most Hated
                        </ResultHeader>
                        {
                            this.props.bottomPoliticians.map((politician: PoliticianOpinions, index) => {
                                return (
                                    <Result politicianOpinions={politician} key={index}/>
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
