const sequelize = require('sequelize');
const db = require('../../database');
const { INTEGER, STRING, DATE }  = sequelize;

const OrganizationProgram = db.define('OrganizationProgram', {
    Org_ID: {
        type: INTEGER,
        foreignKey: true
    },
    Program_ID: {
        type: INTEGER,
        foreignKey: true
    }
}, {
    timestamps: false,
    tableName: 'Organization Programs'
});

module.exports = OrganizationProgram;