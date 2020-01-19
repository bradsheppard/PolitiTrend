import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Globals from '../utils/Globals';
import { makeStyles, Slide, useScrollTrigger } from '@material-ui/core';
import BarItem from './BarItem';
import Link from 'next/link';

const useStyles = makeStyles(() => ({
    title: {
        flexGrow: 0.75,
    },
    titleText: {
        color: 'white',
        textDecoration: 'none'
    }
}));

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
    children?: React.ReactElement;
    overlay?: boolean;
}

function HideOnScroll(props: Props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({ target: window ? window() : undefined });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

const Header = (props: Props) => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <HideOnScroll {...props}>
                <AppBar position="fixed" color="secondary" style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', boxShadow: 'none'}}>
                    <Toolbar>
                        <div className={classes.title}>
                            <Link href='/' passHref>
                                <Typography variant="h6" component='a' className={classes.titleText}>
                                    {capitalize(Globals.name)}
                                </Typography>
                            </Link>
                        </div>
                        <BarItem link='/'>
                            Home
                        </BarItem>
                        <BarItem link='/politicians'>
                            Politicians
                        </BarItem>
                        <BarItem link='test'>
                            Stats
                        </BarItem>
                        <BarItem link='test'>
                            About
                        </BarItem>
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
            {
                !props.overlay ? <Toolbar/> : null
            }
        </React.Fragment>

    );
};

function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export default Header;
