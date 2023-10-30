const { DataTypes } = require('sequelize');
const sequelize = require('../database/database.js');

const Organizations = sequelize.define(
  'organizations',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
    },
    summary: {
      type: DataTypes.STRING(255),
    },
    suite: {
      type: DataTypes.STRING(255),
    },
    streetAddress: {
      type: DataTypes.STRING(255),
    },
    city: {
      type: DataTypes.STRING(255),
    },
    stateProvince: {
      type: DataTypes.STRING(255),
    },
    postalCodeId: {
      type: DataTypes.BIGINT,
    },
    zipCode: {
      type: DataTypes.BIGINT,
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
        isLowercase: true,
      },
    },
    phoneNumber: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: true,
    },
  },
  {
    underscored: true,
    // Other model options go here
  }
);
module.exports = Organizations;