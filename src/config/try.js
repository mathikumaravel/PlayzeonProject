const { Sequelize } = require('sequelize');

async function connectDB() {
  await Sequelize.authenticate();
  await Sequelize.sync({ force: true });
}

connectDB();
