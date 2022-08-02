const { createProxyMiddleware } = require('http-proxy-middleware');
const proxy = {
    // target: 'http://172.24.24.84:31053',
    target: 'http://localhost:31053',
}

module.exports = app => {
    app.use([
        '/search/keyword',
        '/accounts/signin',
        '/accounts/signup',
    ],
        createProxyMiddleware(proxy)
    );
};