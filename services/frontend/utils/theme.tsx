import { createMuiTheme } from '@material-ui/core';

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

export default theme;