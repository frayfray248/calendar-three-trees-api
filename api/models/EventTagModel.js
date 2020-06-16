const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const { STRING, INTEGER } = DataTypes;
const db = require('../../database');
const Event = require('./EventModel');
const Tag = require('./TagModel');

const EventTag = db.define('EventTag', {
    eventId: {
        type: INTEGER(11),
        allowNull: false,
        field: 'Event_ID',
         references: {
             model: Event,
             key: 'Event_ID'
         }
    },
    tagId: {
        type: INTEGER(11),
        allowNull: false,
        field: 'Tag_ID',
         references: {
             model: Tag,
             key: 'Tag_ID'
         }
    }
},
    {
        tableName: 'Event Tags',
        timestamps: false
    });

    module.exports = EventTag;