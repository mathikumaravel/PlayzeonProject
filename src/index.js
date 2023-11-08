const dotenv = require('dotenv');
const app = require("./app");
const sequelize = require("./database/database.js");

dotenv.config();

const PORT = process.env.PORT || 3000;

const main = async () => {
  try {
    console.log('Connection has been established successfully.');
    app.listen(PORT, () => console.log(`Server listening in port: ${PORT}`));
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

main();
