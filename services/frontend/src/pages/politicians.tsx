import * as React from 'react';
import { NextPageContext } from 'next';
import PoliticianApi from '../model/PoliticianApi';
import Politician from '../model/Politician';
import PoliticianSummary from '../components/PoliticianSummary';
import { Grid } from '@material-ui/core';

interface IProps {
    politicians: Array<Politician>;
}

class Politicians extends React.Component<IProps> {

    static async getInitialProps(context: NextPageContext) {
        const politicians = await PoliticianApi.get(context);

        return {
            politicians
        }
    }

    render() {
        return (
            <Grid container
                alignItems='center'
                justify='center'>
                <Grid item sm={8}>
                    <Grid container
                        alignItems='center'
                        justify='center'>
                        {
                            this.props.politicians.map((politician: Politician) => {
                                return (
                                    <Grid item sm={4}>
                                        <PoliticianSummary politician={politician}/>
                                    </Grid>
                                );
                            })
                        }
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default Politicians;