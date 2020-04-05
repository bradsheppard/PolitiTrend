import * as React from 'react';
import PoliticianApi from '../apis/politician/PoliticianApi';
import {
    createStyles,
    Grid, TextField,
    Theme,
    withStyles,
    WithStyles
} from '@material-ui/core';
import ContentContainer from '../components/common/ContentContainer';
import _ from 'lodash';
import PoliticianGridListNew from '../components/politician/PoliticianGridListNew';

const style = (theme: Theme) => createStyles({
    search: {
        width: '100%',
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6)
    }
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

    static async getInitialProps() {
        const politicians = await PoliticianApi.get();

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
                <ContentContainer>
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
                        <Grid item sm={12}>
                            <PoliticianGridListNew politicians={this.props.politicians} />
                        </Grid>
                    </Grid>
                </ContentContainer>
            </React.Fragment>
        );
    }
}

export default withStyles(style)(Politicians);
