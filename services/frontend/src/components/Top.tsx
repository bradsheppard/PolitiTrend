import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Globals from '../utils/Globals';
import { Slide, useScrollTrigger } from '@material-ui/core';

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
    children?: React.ReactElement;
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

    return (
        <React.Fragment>
            {/*<AppBar position="static" color="secondary">*/}
            {/*    <Toolbar>*/}
            {/*        <Typography variant="h5">*/}
            {/*            {capitalize(Globals.name)}*/}
            {/*        </Typography>*/}
            {/*    </Toolbar>*/}
            {/*</AppBar>*/}
            <HideOnScroll {...props}>
                <AppBar position="fixed" color="secondary">
                    <Toolbar>
                        <Typography variant="h5">
                            {capitalize(Globals.name)}
                        </Typography>
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
            <Toolbar />
        </React.Fragment>

    );
};

function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export default Header;