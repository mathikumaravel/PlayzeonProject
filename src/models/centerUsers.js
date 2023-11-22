const { DataTypes } = require('sequelize');
const sequelize = require('../database/database.js');

const CenterUsers = sequelize.define(
  'center_users',
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
    centerId:
    {
      field:'center_id',
      type: DataTypes.INTEGER,
      references: {
        model: 'centers', 
        key: 'id',
     }
    },
  }
);

module.exports = CenterUsers;