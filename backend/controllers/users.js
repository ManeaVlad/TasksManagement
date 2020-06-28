const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const _ = require("lodash");
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "maneavlad1997@gmail.com",
    pass: "",
  },
});
const EMAIL_SECRET = "asdafafeafraefaefea";

exports.createUser = (req, res) => {
  User.findOne({ "local.email": req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({
        message: "User already created!",
      });
    }
  });
  bcrypt.hash(req.body.passwordsGroup.password, 10).then((hash) => {
    const user = new User();
    user.local.email = req.body.email;
    user.local.password = hash;
    jwt.sign(
      {
        user: _.pick(user, "id"),
      },
      EMAIL_SECRET,
      {
        expiresIn: "1d",
      },
      (err, emailToken) => {
        const url = `http://localhost:3000/confirmation/${emailToken}`;
        transporter.sendMail({
          from: "maneavlad1997@gmail.comm",
          to: user.local.email,
          subject: "Confirmation Email from NO-JIRA",
          html: `<h1>NO-JIRA team thanks you for using our service</h1><p>Please click this email to confirm your email: <a href="${url}">${url}</a></p>`,
        });
      }
    );
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created succesfully!",
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: "Invalid authentication credentials!",
        });
      });
  });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ "local.email": req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Invalid user email!",
        });
      }
      if (!user.local.confirmed) {
        return res.status(401).json({
          message: "Please confirm your email to login",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.local.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Invalid authentication credentials!",
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
        userId: fetchedUser._id,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Invalid authentication credentials!",
      });
    });
};

exports.getCompany = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.status(200).json(user.local.companyName);
      } else {
        res.status(404).json({ message: "User not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching users failed.",
      });
    });
};

exports.getUserName = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res
          .status(200)
          .json(
            user.local.userName ? user.local.userName : user.google.userName
          );
      } else {
        res.status(404).json({ message: "User not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching users failed.",
      });
    });
};

exports.getIsAdmin = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.status(200).json(user.local.isAdmin);
      } else {
        res.status(404).json({ message: "User not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching users failed.",
      });
    });
};

exports.updateUser = (req, res, next) => {
  const message = String(req.body.message);
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: {
        "google.companyName": req.body.company,
        "google.activeUser": true,
        "google.isAdmin": message.includes("Company created successfully."),
        "local.companyName": req.body.company,
        "local.activeUser": true,
        "local.isAdmin": message.includes("Company created successfully."),
      },
    }
  )
    .then((result) => {
      if (result) {
        res.status(200).json({ message: "Updated succesfully!" });
      } else {
        res.status(401).json({ message: "Not authorized user." });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Edit failed!",
      });
    });
};

exports.updateUserById = (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        "google.userName": req.body.userName,
        "google.email": req.body.email,
        "google.activeUser": req.body.activeUser,
        "google.isAdmin": req.body.isAdmin,
        "google.phone": req.body.phone,
        "google.role": req.body.role,
        "local.userName": req.body.userName,
        "local.email": req.body.email,
        "local.activeUser": req.body.activeUser,
        "local.isAdmin": req.body.isAdmin,
        "local.phone": req.body.phone,
        "local.role": req.body.role,
      },
    }
  )
    .then((result) => {
      if (result) {
        res.status(200).json({ message: "Updated succesfully!" });
      } else {
        res.status(401).json({ message: "Not authorized user." });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Edit failed!",
      });
    });
};

exports.getUsers = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const userQuery = User.find({
    "local.companyName": req.user.local.companyName,
  });
  let fetchedUsers;
  if (pageSize && currentPage) {
    userQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  userQuery
    .then((documents) => {
      fetchedUsers = documents;
      return User.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Users fetched successfully.",
        user: fetchedUsers,
        maxUsers: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching users failed.",
      });
    });
};

exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json(user.google.id === "" ? user.local : user.google);
      } else {
        res.status(404).json({ message: "User not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching users failed.",
      });
    });
};

exports.deleteUserById = (req, res, next) => {
  User.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "User deleted." });
      } else {
        res.status(401).json({ message: "Not authorized user." });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching users failed.",
      });
    });
};
