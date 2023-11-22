const {DataTypes} = require('sequelize');
const sequelize = require('../database/database.js');

const CenterHours= sequelize.define(
  'center_hours',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    Weekdays: {
        field: 'weekdays',
        type: DataTypes.STRING(255),
    },
    FromTime: {
        field: 'from_time',
        type: DataTypes.TIME,
    },
    ToTime: {
        field: 'to_time',
        type: DataTypes.TIME,
    },
    centerId:
    {
      field:'center_id',
      type: DataTypes.INTEGER,
      references: {
        model: 'centers', 
        key: 'id',
     }
    }
  }
);
module.exports = CenterHours;