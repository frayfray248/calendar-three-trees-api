const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const { STRING, INTEGER } = DataTypes;
const db = require('../../database');

const Contact = db.define('Contact', {
    id: {
        type: INTEGER(11),
        allowNull: false,
        field: 'Contact_ID',
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: STRING(45),
        allowNull: true,
        field: 'Contact_Name'
    },
    email: {
        type: STRING(45),
        allowNull: true,
        field: 'Contact_Email'
    },
    phoneNumber: {
        type: STRING(45),
        allowNull: true,
        field: 'Contact_Phone'
    }
},
    {
        tableName: 'Event Contacts',
        timestamps: false
    });

    


    module.exports = Contact;