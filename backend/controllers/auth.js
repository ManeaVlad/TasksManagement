const jwt = require("jsonwebtoken");

var userId;
var token;

exports.sendJwtToken = (req, res, next) => {
  userId = req.user._id;
  token = jwt.sign(
    { id: userId },
    process.env.JWT_KEY,
    { expiresIn: "1d" }
  );
  res.redirect(`http://localhost:4200/dashboard/?token=${token}`);
};

exports.authenticate = (req, res ,next) => {
  return res.status(200).json({
    token: token,
    expiresIn: 3600,
    userId: userId
  });
};
