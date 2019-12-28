const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.createUser = (req, res, next) => {
  User.findOne({ "local.email": req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({
        message: "User already created!"
      });
    }
  });
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User();
    user.local.email = req.body.email;
    user.local.password = hash;
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created succesfully!"
        });
      })
      .catch(err => {
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
