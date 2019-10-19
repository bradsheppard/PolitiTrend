import * as React from 'react';
import Legislator from '../model/Legislator';
import { Paper, Grid, ListItem, ListItemText } from '@material-ui/core';

interface IProps {
    legislators: Array<Legislator>;
}

class Main extends React.Component<IProps> {
    render() {
        return (
            <Grid container>
                {
                    this.props.legislators.map((legislator: Legislator) => {
                        return (
                            <Grid item xs={12} sm={6}>
                                <ListItem divider={true}>
                                    <ListItemText primary={legislator.name} secondary={legislator.party} />
                                </ListItem>
                            </Grid>
                        )
                    })
                };

                <Grid item xs={12} sm={6}>
                    <Paper  />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper />
                </Grid>
            </Grid>
        );
    }
}

export default Main;
