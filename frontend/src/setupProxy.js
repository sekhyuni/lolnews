const { createProxyMiddleware } = require('http-proxy-middleware');
const proxy = {
    // target: 'http://localhost:5000' // 운영 시
    // target: 'http://172.24.24.84:31221' // 개발 시
    target: 'http://localhost:8080' // 로컬 테스트 시
}

module.exports = (app) => {
    app.use([
        '/search',
    ],
        createProxyMiddleware(proxy)
    );
};