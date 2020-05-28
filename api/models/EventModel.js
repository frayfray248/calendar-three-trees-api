const sequelize = require('sequelize');
const db = require('../../database');
const { INTEGER, STRING, DATE }  = sequelize;

const Event = db.define('Event', {
    Event_ID: {
        type: INTEGER,
        primaryKey: true, 
        autoIncrement: true
    },
    Event_Name: {
        type: STRING
    },
    Event_Content: {
        type: STRING
    },
    Event_Start: {
        type: DATE
    },
    Event_End: {
        type: Date
    },
    Event_MoreInfoURL: {
        type: STRING
    }
}, {
    timestamps: false
});

module.exports = Event;