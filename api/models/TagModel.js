const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const { STRING, INTEGER } = DataTypes;
const db = require('../../database');

const Tag = db.define('Tag', {
    id: {
        type: INTEGER(11),
        allowNull: false,
        field: 'Tag_ID',
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: STRING(45),
        allowNull: false,
        field: 'Tag_Name'
    }
},
    {
        tableName: 'Tags',
        timestamps: false
    });

module.exports = Tag;