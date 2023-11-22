const { DataTypes } = require('sequelize');
const sequelize = require('../database/database.js');

const users = sequelize.define(
    'user',
    {
       id: {
        type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            field: 'first_name',
            type: DataTypes.STRING(255),
        },
        lastName: {
            field: 'last_name',
            type: DataTypes.STRING(255),
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
        organizationName: {
            field: 'organization_name',
            type: DataTypes.STRING(255),
        },
        sportId: {
            field: 'sport_id',
            type: DataTypes.BIGINT,
        },
        role: {
            field: 'role',
            type: DataTypes.STRING(255),
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
        phoneNumber: {
            field: 'phone_number',
            type: DataTypes.STRING(255),
            unique: true,
            allowNull: true,
        }, 
        password: {
            field: 'password',
            type: DataTypes.STRING(255),
            allowNull: false,
        },
         verified:{
            field:"verified",
            type:DataTypes.BOOLEAN,
            defaultValue: false,
        }
    }
);
module.exports = users;