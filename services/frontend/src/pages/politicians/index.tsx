import * as React from 'react'
import PoliticianApi from '../../apis/politician/PoliticianApi'
import { createStyles, Grid, TextField, Theme, withStyles, WithStyles } from '@material-ui/core'
import ContentContainer from '../../components/common/ContentContainer'
import _ from 'lodash'
import PoliticianGridList from '../../components/politicians/PoliticiansGridList'

const style = (theme: Theme) =>
    createStyles({
        search: {
            width: '100%',
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
        },
    })

interface Politician {
    id: number
    name: string
    party: string
    role: string
}

interface IProps extends WithStyles<typeof style> {
    politicians: Politician[]
}

interface IState {
    politicians: Politician[]
}

class Index extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)

        this.state = {
            politicians: props.politicians,
        }
    }

    debounedHandle = _.debounce((event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            politicians: this.props.politicians.filter((politician: Politician) =>
                politician.name.toLowerCase().includes(event.target.value.toLowerCase())
            ),
        })
    }, 1000)

    static async getInitialProps() {
        const politicians = await PoliticianApi.get()

        return {
            politicians,
        }
    }

    handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.persist()
        this.debounedHandle(event)
    }

    render() {
        const { classes } = this.props

        return (
            <React.Fragment>
                <ContentContainer>
                    <Grid container>
                        <Grid item sm={12}>
                            <Grid container alignItems="center" justify="center">
                                <Grid item sm={12}>
                                    <TextField
                                        className={classes.search}
                                        label="Name"
                                        variant="outlined"
                                        onChange={this.handleSearchChange.bind(this)}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item sm={12}>
                            <PoliticianGridList politicians={this.state.politicians} />
                        </Grid>
                    </Grid>
                </ContentContainer>
            </React.Fragment>
        )
    }
}

export default withStyles(style)(Index)
