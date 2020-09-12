import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: 'rgb(36,55,134)'
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
            'Merriweather'
        ].join(','),
        h1: {
            fontFamily: [
                'Raleway'
            ].join(',')
        },
        h2: {
            fontFamily: [
                'Raleway'
            ].join(',')
        },
        h3: {
            fontFamily: [
                'Raleway'
            ].join(',')
        },
        h4: {
            fontFamily: [
                'Raleway'
            ].join(',')
        }
    }
});

export default theme;
