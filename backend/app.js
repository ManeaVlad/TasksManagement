const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const projectsRoutes = require("./routes/projects");
const companiesRoutes = require("./routes/companies");
const tasksRoutes = require("./routes/tasks");
const usersRoutes = require("./routes/users");
const notificationsRoutes = require("./routes/notifications");
const authRoutes = require("./routes/auth");
const jwtStrategy = require("./middleware/passport-jwt");
const googleStrategy = require("./middleware/passport-google");
const session = require("express-session");
const User = require("./models/user");
const jwt = require("jsonwebtoken");

const app = express();
const EMAIL_SECRET = "asdafafeafraefaefea";

mongoose
  .connect(
    "mongodb+srv://bdadmin:" +
      process.env.MONGO_ATLAS_PW +
      "@cluster0-jelkt.mongodb.net/Project-NO-JIRAAA?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to Database");
    console.log(process.env.MONGO_ATLAS_PW);
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
    saveUninitialized: true,
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

app.use("/api/projects", projectsRoutes);
app.use("/api/companies", companiesRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationsRoutes);
app.get("/confirmation/:token", async (req, res, next) => {
  try {
    const {
      user: { id },
    } = jwt.verify(req.params.token, EMAIL_SECRET);
    await User.update({ _id: id }, { "local.confirmed": true });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
  return res.redirect("http://localhost:4200/auth/login");
});
app.get("failure", (req, res, next) => {
  return res.redirect("http://localhost:4200/auth/login");
});

module.exports = app;
