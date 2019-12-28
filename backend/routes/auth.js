const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const passport = require("passport");

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failure" }),
  authController.sendJwtToken
);

module.exports = router;
