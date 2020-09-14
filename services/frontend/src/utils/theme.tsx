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
            ].join(','),
            fontWeight: 900
        },
        h2: {
            fontFamily: [
                'Raleway'
            ].join(','),
            fontWeight: 900
        },
        h3: {
            fontFamily: [
                'Raleway'
            ].join(','),
            fontWeight: 900
        },
        h4: {
            fontFamily: [
                'Raleway'
            ].join(','),
            fontWeight: 900
        },
        h5: {
            fontFamily: [
                'Raleway'
            ].join(','),
            fontWeight: 900
        },
        h6: {
            fontFamily: [
                'Raleway'
            ].join(','),
            fontWeight: 900,
            fontSize: 16
        },
        subtitle1: {
            fontWeight: 900
        }
    }
});

export default theme;
