const express = require('express');
const app = express();
const morgan = require('morgan');

// routes
const groupRoutes = require('./api/routes/groups.js');

// open api documentation
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const OAS = YAML.load('./calendar-three-trees-doc.yml');

// using swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(OAS));

// using morgan logging
app.use(morgan('dev'));

// routes
app.use('/groups', groupRoutes);

module.exports = app;