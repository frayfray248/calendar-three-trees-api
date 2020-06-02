const sequelize = require('sequelize');
const db = require('../../database');
const { INTEGER, STRING, DATE }  = sequelize;

const Tag = db.define('Tag', {
    Tag_ID: {
        type: INTEGER,
        primaryKey: true, 
        autoIncrement: true
    },
    Tag_Name: {
        type: STRING
    }
}, {
    timestamps: false,
    table: 'Tags'
});

module.exports = Tag;