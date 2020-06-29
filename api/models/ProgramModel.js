const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const { STRING, INTEGER} = DataTypes;
const db = require('../../database');

const Program = db.define('Program', {
    id: {
        type: INTEGER(11),
        allowNull: false,
        field: 'Program_ID',
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: STRING(60),
        allowNull: false,
        field: 'Program_Name'
    },
    content: {
        type: STRING(120),
        allowNull: false,
        field: 'Program_Content'
    }
},
    {
        tableName: 'Programs',
        timestamps: false
    });

    module.exports = Program;