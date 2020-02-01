import * as React from 'react';
import { NextPageContext } from 'next';
import PoliticianApi from '../apis/politician/PoliticianApi';
import {
    Card,
    createStyles,
    Grid,
    GridList,
    GridListTile, GridListTileBar, Link as MuiLink,
    TextField,
    Theme,
    withStyles,
    WithStyles
} from '@material-ui/core';
import ContentContainer from '../components/ContentContainer';
import _ from 'lodash';
import Bar from '../components/Bar';
import { politicianNameToImagePath } from '../utils/ImagePath';
import Link from 'next/link';

const style = (theme: Theme) => createStyles({
    search: {
        width: '100%',
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6)
    },
    img: {
        width: '100%',
        height: 'auto'
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

                            <GridList cellHeight={500} cols={3}>
                                {this.props.politicians.map(politician => (
                                    <GridListTile key={politician.id}>
                                        <Link href='/politicians/[id]' as={`/politicians/${politician.id}`}>
                                            <MuiLink href='#'>
                                                <img src={politicianNameToImagePath(politician.name)} alt={politician.name} className={classes.img} />
                                            </MuiLink>
                                        </Link>
                                        <GridListTileBar
                                            title={politician.name}
                                            subtitle={<span>{politician.party}</span>}
                                        />
                                    </GridListTile>
                                ))}
                            </GridList>
                        </Grid>
                    </Card>
                </ContentContainer>
            </React.Fragment>
        );
    }
}

export default withStyles(style)(Politicians);
