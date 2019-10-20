import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
    palette: {
        primary: { main: 'rgb(20,125,218)' },
        secondary: { main: 'rgb(180,2,27)' }
    },
    typography: {
        fontFamily: [
            'Roboto Condensed'
        ].join(',')
    }
});

export default theme;