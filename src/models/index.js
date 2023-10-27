const Sequelize = require("sequelize");
const sequelize = require("../config/dbconfig");
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Organizations = require("./organizations.model");
// db.OrganizationUser = require("./organizationUser.model")(sequelize, Sequelize);
// db.UserDetails = require("./userDetails.model")(sequelize,Sequelize);
// db.Organizations.belongsTo(db.OrganizationUser, {
//     foreignKey: { name: "organization_id" },
//   });
sequelize.sync({force: true});
module.exports = db;