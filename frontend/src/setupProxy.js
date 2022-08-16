const { createProxyMiddleware } = require('http-proxy-middleware');
const proxy = {
    target: 'http://172.24.24.84:31053',
    // target: 'http://localhost:8081',
}

module.exports = app => {
    app.use([
        '/search/keyword',
        '/accounts/signin',
        '/accounts/signup',
        '/word'
    ],
        createProxyMiddleware(proxy)
    );
};