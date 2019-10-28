import { IncomingMessage } from 'http';

const absoluteUrl = (req?: IncomingMessage, setLocalhost?: string) => {
    let protocol = 'http:';
    let host = req ? (req.headers['x-forwarded-host'] || req.headers['host']) : window.location.host;

    if (host && host.indexOf('localhost') > -1) {
        if (setLocalhost) host = setLocalhost;
        protocol = 'http:';
    }

    return {
        protocol: protocol,
        host: host,
        origin: protocol + '//' + host
    };
};

export default absoluteUrl;