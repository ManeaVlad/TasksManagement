const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const postsRoutes = require("./routes/posts");
const usersRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const jwtStrategy = require("./middleware/passport-jwt");
const googleStrategy = require("./middleware/passport-google");
const session = require("express-session");
const User = require("./models/user");

const app = express();

mongoose
  .connect(
    "mongodb+srv://bdadmin:" +
      process.env.MONGO_ATLAS_PW +
      "@cluster0-jelkt.mongodb.net/Project-NO-JIRAA?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to Database");
  })
  .catch(() => {
    console.log("Connection to Database failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.JWT_KEY,
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
jwtStrategy.configureJwtStrategy();
googleStrategy.configureGoogleStrategy();
passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser((id, done) => {
  User.findById(id, (error, user) => {
    done(null, user);
  });
});
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Auth-Token"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS, HEAD"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.get("failure", (req, res, next) => {
  return res.redirect("http://localhost:4200/auth/login");
});

module.exports = app;
