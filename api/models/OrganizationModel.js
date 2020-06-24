const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const { STRING, INTEGER, DATE } = DataTypes;
const db = require('../../database');

const Organization = db.define('Organization', {
    id: {
        type: INTEGER(11),
        allowNull: false,
        field: 'Org_ID',
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: STRING(60),
        allowNull: false,
        field: 'Org_Name'
    },
    licenseKey: {
        type: STRING(15),
        allowNull: true,
        field: 'Org_LicenseKey'
    },
    urlId: {
        type: INTEGER(11),
        allowNull: false,
        field: 'Org_URLID'
    },
    transportToken: {
        type: INTEGER(11),
        allowNull: true,
        field: 'Org_TransportToken'
    }
},
    {
        tableName: 'Organizations',
        timestamps: false
    });

    module.exports = Organization;