const sequelize = require('sequelize');
const db = require('../../database');
const { INTEGER, STRING, DATE }  = sequelize;

const OrganizationTag = db.define('OrganizationTag', {
    Org_ID: {
        type: INTEGER,
        foreignKey: true
    },
    Tag_ID: {
        type: INTEGER,
        foreignKey: true
    }
}, {
    timestamps: false,
    tableName: 'Organization Tags'
});

module.exports = OrganizationTag;