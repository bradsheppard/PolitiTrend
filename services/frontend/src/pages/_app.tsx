import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../utils/theme';
import Globals from '../utils/Globals';
import Bar from '../components/bar/Bar';
import TransparentJumbo from '../components/common/TransparentJumbo';
import Footer from '../components/footer/Footer';

export default class MyApp extends App {
    componentDidMount() {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }

    render() {
        const { Component, pageProps } = this.props;

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
                    <Footer/>
                </ThemeProvider>
            </React.Fragment>
        );
    }
}

function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}
