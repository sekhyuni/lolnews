const { createProxyMiddleware } = require('http-proxy-middleware');
const proxy = {
    // target: 'http://localhost:5000' // 운영 시
    target: 'http://172.24.24.84:31053' // 개발 시
}

module.exports = (app) => {
    app.use([
        '/search',
    ],
        createProxyMiddleware(proxy)
    );
};