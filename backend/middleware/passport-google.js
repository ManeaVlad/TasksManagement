const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth");
const User = require("../models/user");

exports.configureGoogleStrategy = () => {
  passport.use(
    new GoogleStrategy.OAuth2Strategy(
      {
        clientID:
        "952430442794-pdio8e4c53qesj6rclsbn3dg76gddn4s.apps.googleusercontent.com",
        clientSecret: "ZFtLC9yEliOhqmJuDMt7WQTx",
        callbackURL: "http://localhost:3000/api/auth/google/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        const user = await User.findOne({ "google.id": profile.id });
        if (user) {
          return done(null, user);
        }
        const newUser = new User({
          google: {
            id: profile.id,
            token: accessToken,
            userName: profile.displayName,
            email: profile.emails[0].value,
          }
        });
        await newUser.save();
        done(null, newUser);
      }
    )
  );
};
