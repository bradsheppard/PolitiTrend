import * as React from 'react';
import { GridList, GridListTile, GridListTileBar, Link as MuiLink, makeStyles } from '@material-ui/core';
import Link from 'next/link';
import { politicianNameToImagePath } from '../../utils/ImagePath';

interface IProps {
    politicians: Politician[]
}

interface Politician {
    id: number;
    name: string;
    party: string;
}

const useStyles = makeStyles({
    img: {
        width: '100%',
        height: 'auto'
    }
});

const PoliticianGridList = (props: IProps) => {
    const classes = useStyles();

    return (
        <GridList cellHeight={500} cols={3}>
            {props.politicians.map(politician => (
                <GridListTile key={politician.id}>
                    <Link href='/politicians/[id]' as={`/politicians/${politician.id}`}>
                        <MuiLink href='#' className={classes.img}>
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
    )
};

export default PoliticianGridList;
