const { sign, verify } = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const OPTIONS = {
  expiresIn: '30d',
  algorithm: 'HS256',
};

module.exports = {
  generateToken: (object, options = OPTIONS) =>
    new Promise((resolve, reject) => {
      sign(object, JWT_SECRET, options, (error, payload) => {
        if (error) return reject(error);
        return resolve(payload);
      });
    }),
  checkToken: (token) =>
    new Promise((resolve, reject) => {
      verify(token, JWT_SECRET, (error, payload) => {
        if (error) return reject(error);
        return resolve(payload);
      });
    }),
};