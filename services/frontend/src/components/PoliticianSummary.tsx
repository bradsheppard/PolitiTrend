import * as React from 'react';
import { createStyles, Fade, Theme, Typography, withStyles, WithStyles, Link as MuiLink } from '@material-ui/core';
import { politicianNameToImagePath } from '../utils/ImagePath';
import { Waypoint } from 'react-waypoint';
import { useState } from 'react';
import Link from 'next/link';

const styles = (theme: Theme) => createStyles({
    container: {
        margin: theme.spacing(4),
        textAlign: 'center'
    }
});

interface Politician {
    id: number;
    name: string;
    party: string;
}

interface IProps extends WithStyles<typeof styles> {
    politician: Politician;
}

const PoliticianSummary = (props: IProps) => {
    const { politician, classes } = props;

    const [visible, setVisible] = useState(false);

    const onEnterViewport = () => {
        setVisible(true);
    };

    const onExitViewport = () => {
        setVisible(false);
    };

    return (
        <Link href='/politicians/[id]' as={`/politicians/${politician.id}`}>
            <MuiLink href='#'>
                {/*
                    // @ts-ignore */}
                <Waypoint onEnter={onEnterViewport} onLeave={onExitViewport}>
                    <Fade in={visible} timeout={2000}>
                        <div className={classes.container}>
                            <img src={politicianNameToImagePath(politician.name)} alt={politician.name} />
                            <Typography variant='h6' color='primary'>
                                {politician.name}
                            </Typography>
                            <Typography variant='subtitle1' color='primary'>
                                {politician.party}
                            </Typography>
                        </div>
                    </Fade>
                </Waypoint>
            </MuiLink>
        </Link>
    );
};

export default withStyles(styles)(PoliticianSummary);
