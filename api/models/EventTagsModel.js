const sequelize = require('sequelize');
const db = require('../../database');
const { INTEGER, STRING, DATE }  = sequelize;

const EventTag = db.define('EventTag', {
    Event_ID: {
        type: INTEGER,
        foreignKey: true
    },
    Tag_ID: {
        type: INTEGER,
        foreignKey: true
    }
}, {
    timestamps: false,
    tableName: 'Event Tags'
});

module.exports = EventTag;