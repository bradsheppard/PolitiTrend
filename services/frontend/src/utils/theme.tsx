import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: 'rgb(20,125,218)'
        },
        secondary: {
            main: 'rgb(71,71,71)',
        }
    },
    typography: {
        fontFamily: [
            'Lato'
        ].join(',')
    }
});

export default theme;
