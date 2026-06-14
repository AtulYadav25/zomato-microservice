import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

const routes = [
    { path: '/api/restaurant', target: 'http://localhost:3001' },
    { path: '/api/rider', target: 'http://localhost:3002' },
    { path: '/api/user', target: 'http://localhost:3003' },
    { path: '/api/item', target: 'http://localhost:3004' },
    { path: '/api/order', target: 'http://localhost:3005' },
    { path: '/api/payment', target: 'http://localhost:3006' },
]

//Register each route
for (const route of routes) {
  app.use(
    route.path,
    createProxyMiddleware({
      target: route.target,
      changeOrigin: true,
      prependPath: true,

      on: {
        proxyReq: (proxyReq, req) => {
          console.log(
            `${req.method} ${req.originalUrl} -> ${route.target}${req.originalUrl}`
          );
        },
      },
    })
  );
}

app.listen(3000,()=>{
    console.log('Gateway running on PORT: 3000')
})