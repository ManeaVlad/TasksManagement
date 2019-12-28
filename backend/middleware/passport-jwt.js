const User = require("../models/user");
const passport = require("passport");
const passportJwt = require("passport-jwt");

exports.configureJwtStrategy = () => {
  const opts = {};
  opts.jwtFromRequest = passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = process.env.JWT_KEY;
  passport.use(
    new passportJwt.Strategy(opts, (payload, done) => {
      User.findById(payload.userId, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      });
    })
  );
};
