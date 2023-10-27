module.exports = (sequelize, Sequelize) => {
const OrganizationUser = sequelize.define(
  'organization_user',
  {
    organization_user_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      field:'user_id',
      type: Sequelize.INTEGER,
    },
    organization_id:
    {
      field:'organization_id',
      type: Sequelize.INTEGER
    },

  },
);
return OrganizationUser;
}
