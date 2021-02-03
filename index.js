/**
 * Assignment API service.
 */

const express = require('express');
const logger = require('morgan');
const cors = require('cors');

require('dotenv').config();

var errors = require('./lib/routes/errors');
var routes = require('./lib/routes')();
// Express app
const app = express();

// CORS
app.use(cors());

// logger
if (app.get('env') === 'development') {
  app.use(logger('dev'));
} else {
  app.use(logger());
}
// routes
app.use('/', routes);

// error handlers
app.use(errors.notfound);
app.use(errors.error);


module.exports = app;
