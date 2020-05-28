const sequelize = require('sequelize');
const db = require('../../database');
const { INTEGER, STRING, DATE }  = sequelize;

const Location = db.define('Location', {
    Location_ID: {
        type: INTEGER,
        primaryKey: true, 
        autoIncrement: true
    },
    Location_Name: {
        type: STRING
    },
    Location_Address: {
        type: STRING
    },
    Location_PostCode: {
        type: DATE
    }
}, {
    timestamps: false
});

module.exports = Location;