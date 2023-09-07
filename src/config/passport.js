// const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
// const config = require('./config');
// const { tokenTypes } = require('./tokens');
// const { Customer, User } = require('../models');
// const { roles } = require('./roles');

// const jwtOptions = {
//   secretOrKey: config.jwt.secret,
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
// };

// const jwtVerify = async (payload, done) => {
//   try {
//     if (payload.type !== tokenTypes.ACCESS) {
//       throw new Error('Invalid token type');
//     }
//     let user;

//     if (payload.sub.type === roles[0]) {
//       // roles[0] = customer
//       user = await Customer.findById(payload.sub.userId);
//       if (!user) {
//         return done(null, false);
//       }
//     } else if (payload.sub.type === roles[1]) {
//       // roles[1] = tenant
//       user = await User.findById(payload.sub.userId);
//       if (!user) {
//         return done(null, false);
//       }
//     } else {
//       throw new Error('Invalid token');
//     }

//     done(null, user);
//   } catch (error) {
//     done(error, false);
//   }
// };

// const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

// module.exports = {
//   jwtStrategy,
// };
