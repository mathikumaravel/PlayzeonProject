const { DataTypes, Sequelize } = require('sequelize');
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
      type: Sequelize.INTEGER,
    },
    orgId:
    {
      field:'organization_id',
      type: Sequelize.INTEGER
    },
  }
);
module.exports = OrganizationUsers;