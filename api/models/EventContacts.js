const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const { STRING, INTEGER } = DataTypes;
const db = require('../../database');
const Contact = require('./ContactModel');
const Event = require('../models/EventModel');

const EventContact = db.define('EventContact', {
    eventId: {
        type: INTEGER(11),
        allowNull: false,
        field: 'Event_ID',
         references: {
             model: Event,
             key: 'Event_ID'
         }
    },
    contactId: {
        type: INTEGER(11),
        allowNull: false,
        field: 'Contact_ID',
         references: {
             model: Contact,
             key: 'Contact_ID'
         }
    }
},
    {
        tableName: 'Event Contacts',
        timestamps: false
    });

    module.exports = EventContact;