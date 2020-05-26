const express = require('express');
const app = express();

// database connection
const database = require('./database.js');

// open api documentation
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const OAS = YAML.load('./calendar-three-trees-doc.yml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(OAS));

 app.use((req, res, next) => {

    var connectionStatus;

    database.connect(function(err, connectionStatus) {
        if (err) {
            connectionStatus = err.message;
            console.log(err);
        }
        else connectionStatus = "connected to database!";
      });

    res.status(200).json({
        message: 'It worked!'
    });
});

module.exports = app;