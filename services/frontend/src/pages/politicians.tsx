import * as React from 'react';
import { NextPageContext } from 'next';
import PoliticianApi from '../apis/politician/PoliticianApi';
import PoliticianSummary from '../components/PoliticianSummary';
import { Card, createStyles, Grid, TextField, Theme, withStyles, WithStyles } from '@material-ui/core';
import ContentContainer from '../components/ContentContainer';
import _ from 'lodash';
import Bar from '../components/Bar';

const style = (theme: Theme) => createStyles({
    search: {
        width: '100%',
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6)
    },
});

interface Politician {
    id: number;
    name: string;
    party: string;
}

interface IProps extends WithStyles<typeof style> {
    politicians: Politician[];
}

interface IState {
    search: string;
}

class Politicians extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            search: ''
        }
    }

    static async getInitialProps(context: NextPageContext) {
        const politicians = await PoliticianApi.get(context);

        return {
            politicians
        }
    }

    handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.persist();

        const debounedHandle = _.debounce(() => {
            this.setState({
                search: event.target.value
            });
        }, 1000);
        debounedHandle();
    }

    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Bar/>
                <ContentContainer>
                    <Card>
                        <Grid container
                            alignItems='center'
                            justify='center'>
                            <Grid item sm={12}>
                                <Grid container
                                    alignItems='center'
                                    justify='center'>
                                    <Grid item sm={8}>
                                        <TextField className={classes.search} label="Name" variant="outlined" onChange={this.handleSearchChange.bind(this)} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            {
                                this.props.politicians.map((politician: Politician, index) => {
                                    if(politician.name.includes(this.state.search))
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
            </React.Fragment>
        );
    }
}

export default withStyles(style)(Politicians);
