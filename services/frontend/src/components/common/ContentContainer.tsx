import * as React from 'react'
import { Grid } from '@material-ui/core'

class ContentContainer extends React.Component {
    render(): JSX.Element {
        return (
            <Grid container alignItems="center" direction="row" justify="center">
                <Grid item xs={12} md={8}>
                    {this.props.children}
                </Grid>
            </Grid>
        )
    }
}

export default ContentContainer
