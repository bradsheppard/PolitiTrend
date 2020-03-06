import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: 'rgb(20,125,218)'
        },
        secondary: {
            main: 'rgb(71,71,71)',
        },
        background: {
            default: 'rgb(255,255,255)'
        }
    },
    typography: {
        fontFamily: [
            'Lato'
        ].join(','),
        h1: {
            fontFamily: [
                'Roboto Condensed'
            ].join(',')
        },
        h2: {
            fontFamily: [
                'Roboto Condensed'
            ].join(',')
        },
        h3: {
            fontFamily: [
                'Roboto Condensed'
            ].join(',')
        }
    }
});

export default theme;
