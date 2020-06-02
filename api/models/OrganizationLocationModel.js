const sequelize = require('sequelize');
const db = require('../../database');
const { INTEGER, STRING, DATE }  = sequelize;

const OrganizationLocation = db.define('OrganizationLocation', {
    Location_ID: {
        type: INTEGER,
        foreignKey: true
    },
    Org_ID: {
        type: INTEGER,
        foreignKey: true
    }
}, {
    timestamps: false,
    tableName: 'Organization Location'
});

module.exports = OrganizationLocation;