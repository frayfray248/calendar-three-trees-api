const express = require('express');
const app = express();

// database connection
const database = require('./database.js');

// open api documentation
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const OAS = YAML.load('./calendar-three-trees-doc.yml');

// routes
const groupRoutes = require('./api/routes/groups.js');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(OAS));

app.use('/groups', groupRoutes);

module.exports = app;