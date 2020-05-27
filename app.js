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

// error message for all requests that get passed the implemented routes
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status) || 500;
    res.json({
        error: {
            message: error.message
        }
    })
});


module.exports = app;