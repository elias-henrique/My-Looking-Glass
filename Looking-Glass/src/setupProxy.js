const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.bgpview.io',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  );
};
