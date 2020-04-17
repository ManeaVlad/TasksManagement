const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const _ = require("lodash");
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "maneavlad1997@gmail.com",
    pass: "Energystar007"
  }
});
const EMAIL_SECRET = "asdafafeafraefaefea";

exports.createUser = (req, res) => {
  User.findOne({ "local.email": req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({
        message: "User already created!"
      });
    }
  });
  bcrypt.hash(req.body.passwordsGroup.password, 10).then(hash => {
    const user = new User();
    user.local.email = req.body.email;
    user.local.password = hash;
    jwt.sign(
      {
        user: _.pick(user, "id")
      },
      EMAIL_SECRET,
      {
        expiresIn: "1d"
      },
      (err, emailToken) => {
        const url = `http://localhost:3000/confirmation/${emailToken}`;
        transporter.sendMail({
          from: "maneavlad1997@gmail.comm",
          to: user.local.email,
          subject: "Confirmation Email from NO-JIRA",
          html: `<h1>NO-JIRA team thanks you for using our service</h1><p>Please click this email to confirm your email: <a href="${url}">${url}</a></p>`
        });
      }
    );
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created succesfully!"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(400).json({
          message: "Invalid authentication credentials!"
        });
      });
  });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ "local.email": req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Invalid user email!"
        });
      }
      if (!user.local.confirmed) {
        return res.status(401).json({
          message: "Please confirm your email to login"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.local.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Invalid authentication credentials!"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
};
