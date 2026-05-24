const { createProxyMiddleware } = require("http-proxy-middleware");

const backendUrl = process.env.REACT_APP_API_SERVER || "http://localhost:8081";

module.exports = function setupBackendProxy(app) {
  app.use(
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true,
      pathFilter: ["/test", "/user", "/photosOfUser", "/commentsOfUser"],
    })
  );
};