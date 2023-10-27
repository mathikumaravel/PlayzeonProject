const Sequelize = require("sequelize");
 
const sequelize = new Sequelize('play', 'postgres','Password@11', {
  host: 'localhost',
  port: '5432',
  // schema:'playzeon',
  dialect: 'postgres',
  logging: true
});
console.log("saran");
 
module.exports = sequelize;