const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://13.209.201.210:5000',
      // target: 'http://localhost:5000',
      changeOrigin: true,
    }),
  );
};
