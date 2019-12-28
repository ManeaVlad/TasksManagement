const jwt = require("jsonwebtoken");

exports.sendJwtToken = (req, res, next) => {
  const token = jwt.sign(
    { id: req.user._id },
    process.env.JWT_KEY,
    { expiresIn: "1d" }
  );
};
