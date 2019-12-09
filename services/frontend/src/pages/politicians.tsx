import * as React from 'react';
import { NextPageContext } from 'next';
import PoliticianApi from '../model/PoliticianApi';
import Politician from '../model/Politician';
import PoliticianSummary from '../components/PoliticianSummary';
import { Card, Grid } from '@material-ui/core';
import ContentContainer from '../components/ContentContainer';

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
            <ContentContainer>
                <Card>
                    <Grid container
                        alignItems='center'
                        justify='center'>
                        {
                            this.props.politicians.map((politician: Politician, index) => {
                                return (
                                    <Grid item sm={3} key={index}>
                                        <PoliticianSummary politician={politician}/>
                                    </Grid>
                                );
                            })
                        }
                    </Grid>
                </Card>
            </ContentContainer>
        );
    }
}

export default Politicians;