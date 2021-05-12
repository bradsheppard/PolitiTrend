import React from 'react'
import Head from 'next/head'
import { ThemeProvider } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '../utils/theme'
import Globals from '../utils/globals'
import Bar from '../components/bar/Bar'
import TransparentJumbo from '../components/common/TransparentJumbo'
import Footer from '../components/footer/Footer'
import App, { AppContext, AppProps } from 'next/app'
import { getSession } from 'next-auth/client'

export default function MyApp(props: AppProps): JSX.Element {
    const { Component, pageProps } = props

    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side')
        if (jssStyles) {
            jssStyles.parentElement?.removeChild(jssStyles)
        }
    }, [])

    return (
        <React.Fragment>
            <Head>
                <title>{capitalize(Globals.name)}</title>
            </Head>
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <Bar />
                <TransparentJumbo />
                <Component {...pageProps} />
                <Footer />
            </ThemeProvider>
        </React.Fragment>
    )
}

MyApp.getInitialProps = async (context: AppContext) => {
    const appProps = await App.getInitialProps(context)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const session = await getSession(context)

    if (!session) {
        context.ctx.res?.writeHead(302, {
            Location: '/api/auth/signin',
        })
        context.ctx.res?.end()
    }

    return {
        ...appProps,
    }
}

function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1)
}
