const { DataTypes } = require('sequelize');
const sequelize = require('../database/database.js');


const OrganizationUsers = sequelize.define(
  'organization_users',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    userId: {
      field:'user_id',
      type: DataTypes.INTEGER,
      references: {
        model: 'users', 
        key: 'id',
     }
    },
    orgId:
    {
      field:'organization_id',
      type: DataTypes.INTEGER,
      references: {
        model: 'organizations', 
        key: 'id',
     }
    },
  }
);

module.exports = OrganizationUsers;