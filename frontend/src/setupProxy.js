const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {
    app.use(
        createProxyMiddleware([
            '/accounts/signin',
            '/accounts/signup',
            '/search/keyword',
            '/word',
            '/article',
        ], {
            target: 'http://172.24.24.84:31053',
            router: {
                '/wordcloud': 'http://172.24.24.84:31707',
                '/related-word': 'http://172.24.24.84:31707',
            }
        })
    );
};