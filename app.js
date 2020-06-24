// env config for db
require('dotenv').config();

// module imports
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// file imports
const OAS = YAML.load('./calendar-three-trees-doc.yml');

// routes imports
const groupRoutes = require('./api/routes/groups.js');


// swagger documentation middleware 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(OAS));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));

// body parser middleware
app.use(bodyParser.json());

// CORS handling middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Request-With, Content-Type, Accept', 'Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

////////////////
//// ROUTES ////
////////////////

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