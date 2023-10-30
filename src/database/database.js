const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

dotenv.config();

const db = {
  name: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  options: {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    storage: process.env.DB_STORAGE,
  },
};

const sequelize = new Sequelize(
  db.name,
  db.user,
  db.password,
  db.options
);
module.exports = sequelize;