const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const { STRING, INTEGER, DATE } = DataTypes;
const db = require('../../database');
const Event = require('../models/EventModel');

const Location = db.define('Location', {
    id: {
        type: INTEGER(11),
        allowNull: false,
        field: 'Location_ID',
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: STRING(60),
        allowNull: false,
        field: 'Location_Name'
    },
    address: {
        type: STRING(60),
        allowNull: false,
        field: 'Location_Address'
    },
    postalCode: {
        type: STRING(6),
        allowNull: false,
        field: 'Location_PostCode'
    },
},
    {
        tableName: 'Locations',
        timestamps: false
    });

    


module.exports = Location;