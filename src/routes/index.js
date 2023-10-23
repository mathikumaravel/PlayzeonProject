
// v1/auth/router.js

const express = require('express');
const router = express.Router();
const userRoute = require('./v1/authRouter');
const  loginRoute = require('./v1/loginRouter')
// Define your route handlers and middleware here
  console.log('router')
  const defaultRoutes = [
    {
      path: '/user',
      route: userRoute,
    },
    {
      path: '/auth',
      route: loginRoute,
    },
    
  ];
  
  defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });

module.exports = router; // Export the router from this module
