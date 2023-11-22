const express = require('express');
const router = express.Router();
const authRoute = require('./v1/auth.routes');
const userRoute = require('./v1/user.routes');
const centerRoute= require('./v1/center.routes');
  const defaultRoutes = [
    {
      path: '/auth',
      route: authRoute,
    },
    {
      path:'/user',
      route: userRoute,
    },
    {
      path:'/center',
      route: centerRoute,
    }
  ];
  
  defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });

module.exports = router;
