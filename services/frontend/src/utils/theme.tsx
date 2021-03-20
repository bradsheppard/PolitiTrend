import { createMuiTheme } from '@material-ui/core'
import Globals from './Globals'

const theme = createMuiTheme({
    palette: {
        primary: {
            main: Globals.blue,
        },
        secondary: {
            main: 'rgb(26,27,31)',
        },
        background: {
            default: 'rgb(255,255,255)',
        },
    },
    typography: {
        fontFamily: ['Merriweather'].join(','),
        h1: {
            fontFamily: ['Raleway'].join(','),
            fontWeight: 900,
        },
        h2: {
            fontFamily: ['Raleway'].join(','),
            fontWeight: 900,
        },
        h3: {
            fontFamily: ['Raleway'].join(','),
            fontWeight: 900,
        },
        h4: {
            fontFamily: ['Raleway'].join(','),
            fontWeight: 900,
        },
        h5: {
            fontFamily: ['Raleway'].join(','),
            fontWeight: 900,
        },
        h6: {
            fontFamily: ['Raleway'].join(','),
            fontWeight: 900,
            fontSize: 16,
        },
        subtitle1: {
            fontWeight: 900,
        },
    },
})

export default theme
