const sequelize = require('sequelize');
const db = require('../../database');
const { INTEGER, STRING, DATETIME }  = sequelize;

const Event = db.define('Event', {
    Event_ID: {
        type: INTEGER,
        primaryKey: true, 
        autoIncrement: true
    },
    Event_Name: {
        type: STRING
    }
}, {
    timestamps: false
});

module.exports = Event;