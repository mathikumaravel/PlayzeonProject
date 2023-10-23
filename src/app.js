const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const httpStatus = require('http-status');
const router = require('./routes/index');
const express = require('express');
const { allowedMethods } = require('./middlewares/allowedMethods');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError'); 
const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data

// gzip compression
app.use(compression());
app.use(allowedMethods);

// enable cors
app.use(cors());
app.options('*', cors());

app.get('/', (req, res) => {
  res.send('hello world');
});
app.use('/api', router);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});
app.use(errorConverter);

// handle error
app.use(errorHandler);


module.exports = app;