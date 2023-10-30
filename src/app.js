const express = require('express');
const routes = require('./routes/index');

const app = express();
/* middlewares */
app.use(express.json());
/* routes */
app.use('/api', routes);

module.exports = app;