const { DataTypes } = require('sequelize');
const sequelize = require('../database/database.js');

const Centers= sequelize.define(
  'centers',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    firstName: {
        field: 'first_name',
        type: DataTypes.STRING(255),
    },
    lastName: {
        field: 'last_name',
        type: DataTypes.STRING(255),
    },
    displayName:{
       field: 'display_name',
       type:  DataTypes.BOOLEAN,
    },
    suite: {
      field: 'suite',
      type: DataTypes.STRING(255),
    },
    streetAddress: {
      field: 'street_address',
      type: DataTypes.STRING(255),
    },
    city: {
      field: 'city',
      type: DataTypes.STRING(255),
    },
    stateProvince: {
      field: 'state_province',
      type: DataTypes.STRING(255),
    },
    postalCodeId: {
      field: 'postal_code_id',
      type: DataTypes.BIGINT,
    },
    zipCode: {
      field: 'zip_code',
      type: DataTypes.BIGINT,
    },
    email: {
      field: 'email',
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
        isLowercase: true,
      },
    },
    phoneNumber: {
      field: 'phone_number',
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: true,
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
    createdBy: {
      field:'created_by',
      type: DataTypes.INTEGER,
      references: {
        model: 'users', 
        key: 'id',
     }
    },
  }
);
module.exports = Centers;