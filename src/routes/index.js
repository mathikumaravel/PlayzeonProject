
// v1/auth/router.js

const express = require('express');
const router = express.Router();
const authRoute = require('./v1/auth.routes');
  const defaultRoutes = [
    {
      path: '/auth',
      route: authRoute,
    },
  ];
  
  defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });

module.exports = router;
