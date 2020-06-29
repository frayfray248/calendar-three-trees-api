const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const { STRING, INTEGER } = DataTypes;
const db = require('../../database');
const Organization = require('./OrganizationModel');
const Program = require('./ProgramModel');

const OrganizationProgram = db.define('OrganizationProgram', {
    organizationId: {
        type: INTEGER(11),
        allowNull: false,
        field: 'Org_ID',
        references: {
            model: Organization,
            key: 'Org_ID'
        }
    },
    programId: {
        type: INTEGER(11),
        allowNull: false,
        field: 'Program_ID',
        references: {
            model: Program,
            key: 'Program_ID'
        }
    }
},
    {
        tableName: 'Organization Programs',
        timestamps: false
    });

module.exports = OrganizationProgram;