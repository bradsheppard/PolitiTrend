import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Globals from '../../utils/Globals';
import { makeStyles, Theme } from '@material-ui/core';
import BarItem from './BarItem';
import Link from 'next/link';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';


const useStyles = makeStyles((theme: Theme) => ({
    title: {
        flexGrow: 0.70,
    },
    items: {
        textAlign: 'right',
        flexGrow: 0.15
    },
    icons: {
        textAlign: 'right',
        flexGrow: 0.15,
        height: '100%'
    },
    icon: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2)
    },
    titleText: {
        color: 'white',
        textDecoration: 'none'
    }
}));

const Header = () => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <AppBar position="fixed" color="secondary" style={{ backgroundColor: 'rgba(0,0,0,0.9)'}}>
                <Toolbar>
                    <div className={classes.title}>
                        <Link href='/' passHref>
                            <Typography variant="h6" component='a' className={classes.titleText}>
                                {capitalize(Globals.name)}
                            </Typography>
                        </Link>
                    </div>
                    <div className={classes.items}>
                        <BarItem link='/'>
                            Home
                        </BarItem>
                        <BarItem link='/politicians'>
                            Politicians
                        </BarItem>
                        <BarItem link='/stats'>
                            Stats
                        </BarItem>
                        <BarItem link='/about'>
                            About
                        </BarItem>
                    </div>
                    <div className={classes.icons}>
                        <FacebookIcon className={classes.icon} />
                        <TwitterIcon className={classes.icon} />
                    </div>
                </Toolbar>
            </AppBar>
        </React.Fragment>

    );
};

function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export default Header;
