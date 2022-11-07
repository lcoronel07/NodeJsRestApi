// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger_output.json')

// defining the Express app
const app = express();

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// starting the server
  app.listen(3001, () => {
    console.log('listening on port 3001');
  });
  
// use swagger
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

//use endpoints
require('./endpoints')(app);

