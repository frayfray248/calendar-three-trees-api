const sequelize = require('sequelize');
const db = require('../../database');
const { INTEGER, STRING, DATE }  = sequelize;

const Organization = db.define('Organization', {
    Org_ID: {
        type: INTEGER,
        primaryKey: true, 
        autoIncrement: true
    },
    Org_LicenseKey: {
        type: STRING
    },
    Org_Name: {
        type: STRING
    },
    Org_URLID: {
        type: INTEGER
    }
}, {
    timestamps: false
});

module.exports = Organization;