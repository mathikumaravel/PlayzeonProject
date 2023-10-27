module.exports = (sequelize, Sequelize) => {
  const Organizations = sequelize.define(
    'organizations',
    {
      OrganizationsId: {
        field: 'organizations_id',
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        field: 'title',
        type: Sequelize.STRING(255),
      },
      summary: {
        field: 'summary',
        type: Sequelize.STRING(255),
      },
      suite: {
        field: 'suite',
        type: Sequelize.STRING(255),
      },
      streetAddress: {
        field: 'street_address',
        type: Sequelize.STRING(255),
      },
      City: {
        field: 'city',
        type: Sequelize.STRING(255),
      },
      stateProvince: {
        field: 'state_province',
        type: Sequelize.STRING(255),
      },
      postalCodeId: {
        field: 'postal_code_id',
        type: Sequelize.BIGINT,
      },
      zipCode: {
        field: 'zip_code',
        type: Sequelize.BIGINT,
      },
      emailId: {
        field: 'email_id',
        type: Sequelize.STRING(255),
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
          isLowercase: true,
        },
      },
      phoneNumber: {
        field: 'phone_number',
        type: Sequelize.STRING(255),
        unique: true,
        allowNull: false,
      },
    },
  );
  return Organizations;
}

// const { Sequelize } = require("sequelize");
// const  sequelize  = require("../config/dbconfig");
// const organizations = sequelize.define(
//       'organizations',
//       {
//         id: {
//           type: Sequelize.INTEGER,
//           primaryKey: true,
//           autoIncrement: true,
//         },
//         title: {
//           field: 'title',
//           type: Sequelize.STRING(255),
//         },
//         summary: {
//           field: 'summary',
//           type: Sequelize.STRING(255),
//         },
//         suite: {
//           field: 'suite',
//           type: Sequelize.STRING(255),
//         },
//         streetAddress: {
//           field: 'street_address',
//           type: Sequelize.STRING(255),
//         },
//         city: {
//           field: 'city',
//           type: Sequelize.STRING(255),
//         },
//         stateProvince: {
//           field: 'state_province',
//           type: Sequelize.STRING(255),
//         },
//         postalCodeId: {
//           field: 'postal_code_id',
//           type: Sequelize.BIGINT,
//         },
//         zipCode: {
//           field: 'id',
//           type: Sequelize.BIGINT,
//         },
//         email: {
//           field: 'email_id',
//           type: Sequelize.STRING(255),
//           unique: true,
//           allowNull: false,
//           validate: {
//             isEmail: true,
//             isLowercase: true,
//           },
//         },
//         phoneNumber: {
//           field: 'phone_number',
//           type: Sequelize.STRING(255),
//           unique: true,
//           allowNull: true, // TODO While Registering Tenant Mobile numb is not received
//         },
//       },
//     );
// module.exports= organizations;