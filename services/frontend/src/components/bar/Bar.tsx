import * as React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Globals from '../../utils/Globals'
import { makeStyles, Theme } from '@material-ui/core/styles'
import BarItem from './BarItem'
import Link from 'next/link'
import FacebookIcon from '@material-ui/icons/Facebook'
import TwitterIcon from '@material-ui/icons/Twitter'
import { signOut } from 'next-auth/client'
import { Drawer, IconButton, List } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { useState } from 'react'
import BarMenuItem from './BarMenuItem'

const useStyles = makeStyles((theme: Theme) => ({
    title: {
        flexGrow: 0.2,
    },
    hamburger: {
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    items: {
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
        flexGrow: 0.2,
    },
    icons: {
        textAlign: 'right',
        flexGrow: 0.4,
    },
    icon: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
    },
    titleText: {
        color: 'white',
        textDecoration: 'none',
        fontWeight: 700,
    },
    signOut: {
        cursor: 'pointer',
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
        flexGrow: 0.2,
    },
}))

const Bar: React.FC = () => {
    const classes = useStyles()
    const [drawerOpen, setDrawerOpen] = useState(false)

    const menuClicked = () => {
        setDrawerOpen(!drawerOpen)
    }

    const closeDrawer = () => {
        setDrawerOpen(false)
    }

    const capitalize = (word: string) => {
        return word.charAt(0).toUpperCase() + word.slice(1)
    }

    return (
        <React.Fragment>
            <AppBar position="fixed" color="secondary">
                <Toolbar>
                    <div className={classes.title}>
                        <IconButton
                            className={classes.hamburger}
                            edge="start"
                            color="inherit"
                            onClick={menuClicked}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Drawer open={drawerOpen} onClose={closeDrawer}>
                            <List>
                                <BarMenuItem text="Home" link="/" />
                                <BarMenuItem text="Politicians" link="/politicians" />
                                <BarMenuItem text="Stats" link="/stats" />
                                <BarMenuItem text="About" link="/about" />
                                <BarMenuItem text="Sign Out" link="/api/auth/signout" />
                            </List>
                        </Drawer>
                        <Link href="/" passHref>
                            <Typography variant="h6" component="a" className={classes.titleText}>
                                {capitalize(Globals.name)}
                            </Typography>
                        </Link>
                    </div>
                    <div className={classes.items}>
                        <BarItem link="/">Home</BarItem>
                        <BarItem link="/politicians">Politicians</BarItem>
                        <BarItem link="/stats">Stats</BarItem>
                        <BarItem link="/about">About</BarItem>
                    </div>
                    <div className={classes.signOut}>
                        <Typography variant="h6" onClick={() => signOut()} component="a">
                            Sign Out
                        </Typography>
                    </div>
                    <div className={classes.icons}>
                        <FacebookIcon className={classes.icon} />
                        <TwitterIcon className={classes.icon} />
                    </div>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    )
}

export default Bar
