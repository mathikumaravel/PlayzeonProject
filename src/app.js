const express = require('express');
const routes = require('./routes/index');
const user = require('./models/users');
const organizations = require('./models/organizations');

const app = express();
organizations.hasOne(user, { foreignKey: 'createBy' });


/* middlewares */
app.use(express.json());
/* routes */
app.use('/api', routes);

module.exports = app;