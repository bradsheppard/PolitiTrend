import express from 'express';
import next from 'next'

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const devProxy: { [path: string]: any} = {
    '/': {
        target: 'http://frontend/',
        changeOrigin: true
    }
};

app.prepare().then(() => {
    const server = express();

    if (dev && devProxy) {
        const proxyMiddleware = require('http-proxy-middleware');
        Object.keys(devProxy).forEach((context) => {
            server.use(proxyMiddleware(context, devProxy[context]));
        })
    }

    server.get('/a', (req, res) => {
        return app.render(req, res, '/a', req.query);
    });

    server.get('/b', (req, res) => {
        return app.render(req, res, '/b', req.query);
    });

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, err => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`)
    });

// tslint:disable-next-line:no-console
    console.log(`> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV}`)
});
