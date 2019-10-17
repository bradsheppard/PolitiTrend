import { createMuiTheme, createStyles, MuiThemeProvider, withStyles, WithStyles } from "@material-ui/core";
import * as React from 'react';

const styles = () => createStyles({
    root: {
        flexGrow: 1,
    }
});

const theme = createMuiTheme({
    palette: {
        primary: { main: 'rgb(110, 110, 110)' },
        secondary: { main: 'rgb(110, 110, 110)' }
    },
    typography: {
        fontFamily: [
            'Roboto Condensed'
        ].join(',')
    }
});

interface IProps extends WithStyles<typeof styles> {}

class App extends React.Component<IProps> {
    public render() {
        const { classes } = this.props;

        return (
            <MuiThemeProvider theme={theme}>
                <div className={classes.root}>

                </div>
            </MuiThemeProvider>
        );
    }
}

export default withStyles(styles)(App);

//
// import React from 'react'
// import Link from 'next/link'
//
// export default () => (
//     <ul>
//         <li>
//             <Link href="/a" as="/a">
//                 <a>a</a>
//             </Link>
//         </li>
//         <li>
//             <Link href="/b" as="/b">
//                 <a>b</a>
//             </Link>
//         </li>
//     </ul>
// )
