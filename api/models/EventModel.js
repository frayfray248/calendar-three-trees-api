const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const { STRING, INTEGER, DATE } = DataTypes;
const Location = require('../models/LocationModel');
const db = require('../../database');

const Event = db.define('Event', {
    id: {
        type: INTEGER(11),
        allowNull: false,
        field: 'Event_ID',
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: STRING(60),
        allowNull: false,
        field: 'Event_Name'
    },
    content: {
        type: STRING(120),
        allowNull: false,
        field: 'Event_Content'
    },
    startDate: {
        type: DATE,
        allowNull: false,
        field: 'Event_Start'
    },
    endDate: {
        type: DATE,
        allowNull: false,
        field: 'Event_End',
    },
    moreInforUrl: {
        type: STRING(90),
        allowNull: true,
        field: 'Event_MoreInfoURL',
        default: null
    },
    locationId: {
        type: INTEGER(11),
        allowNull: false,
        field: 'Location_ID',
         references: {
             model: Location,
             key: 'Location_ID'
         }
    },
    programId: {
        type: INTEGER(11),
        allowNull: false,
        field: 'Program_ID'
        // references: {
        //     model: Program,
        //     key: 'Program_ID'
        // }
    }
},
    {
        tableName: 'Events',
        timestamps: false
    });

    


    module.exports = Event;