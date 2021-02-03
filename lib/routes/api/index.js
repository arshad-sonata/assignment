/**
 * HTTP API endpoints.
 */

const express = require('express');
const router = express.Router();


module.exports = () => {

  const candidateApi = require('./candidate')();
  
  
  // mounting APIs
  router.use('/candidate/', candidateApi);
  
  // mounting APIs
 

  return router;
};


