const { createProxyMiddleware } = require("http-proxy-middleware");

const backendUrl = process.env.REACT_APP_API_SERVER || "http://localhost:8081";
const apiPaths = [
  "/admin",
  "/test",
  "/user",
  "/photosOfUser",
  "/commentsOfPhoto",
  "/commentsOfUser",
  "/images",
];

module.exports = function setupBackendProxy(app) {
  app.use(
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true,
      pathFilter: (pathname) =>
        apiPaths.some(
          (apiPath) => pathname === apiPath || pathname.startsWith(`${apiPath}/`)
        ),
    })
  );
};
