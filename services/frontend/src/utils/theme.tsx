import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: 'rgb(52,99,205)'
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
        },
        h4: {
            fontFamily: [
                'Roboto Condensed'
            ].join(',')
        }
    }
});

export default theme;
