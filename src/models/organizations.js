const { DataTypes } = require('sequelize');
const sequelize = require('../database/database.js');
const users = require('./users.js');

const organizations = sequelize.define(
  'organizations',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    title: {
      field:'title',
      type: DataTypes.STRING(255),
    },
    summary: {
      field:'summary',
      type: DataTypes.STRING(255),
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
    createdBy: {
      field:'created_by',
      type: DataTypes.INTEGER,
      references: {
        model: 'users', 
        key: 'id',
     }
    },
  },
  {
    underscored: true,
  }
);

organizations.hasMany(users, { foreignKey: 'createdBy' });
module.exports = organizations;