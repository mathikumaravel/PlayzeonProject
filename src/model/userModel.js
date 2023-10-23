const { DataTypes} = require('sequelize');
const { Sequelize } = require('sequelize');

// eslint-disable-next-line no-undef
const sequelize = new Sequelize('postgres','postgres', 'Password@11', {
  host: 'localhost',
  dialect: 'postgres',
  port: '5432',
  schema:'playzeon'
});
const Users = sequelize.define(
  'user_details',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    email: {
      field: 'email_id',
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
      unique: 'mobile_number',
      allowNull: true, // TODO While Registering Tenant Mobile numb is not received
    },
    orgName: {
      field: 'organization_name',
      type: DataTypes.STRING(255),
    },
    org_id: {
      type: DataTypes.BIGINT,
      allowNull: true, 
      },
      sport_id: {
        type: DataTypes.BIGINT,
        allowNull: true, 
      },
    role: {
        type: DataTypes.STRING(255),
      // allowNull: false,
    },password: {
      field: 'password',
      type: DataTypes.STRING(255),
    },
  },
  {
    underscored: true,
    timestamps: false,
    // Other model options go here
  }
);


module.exports = Users;
