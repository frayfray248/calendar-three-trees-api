const sequelize = require('sequelize');
const db = require('../../database');
const { INTEGER, STRING, DATE }  = sequelize;

const Program = db.define('Program', {
    Program_ID: {
        type: INTEGER,
        primaryKey: true, 
        autoIncrement: true
    },
    Program_Content: {
        type: STRING
    }
}, {
    timestamps: false,
    tableName: 'Programs'
});

module.exports = Program;