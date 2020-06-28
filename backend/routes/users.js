const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const passport = require("passport");

router.post("/signup", userController.createUser);

router.post("/login", userController.userLogin);

router.get(
  "/getCompany",
  passport.authenticate("jwt", { session: false }),
  userController.getCompany
);

router.get(
  "/getIsAdmin",
  passport.authenticate("jwt", { session: false }),
  userController.getIsAdmin
);

router.get(
  "/getUserName",
  passport.authenticate("jwt", { session: false }),
  userController.getUserName
);

router.patch(
  "",
  passport.authenticate("jwt", { session: false }),
  userController.updateUser
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userController.updateUserById
);

router.get(
  "",
  passport.authenticate("jwt", { session: false }),
  userController.getUsers
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userController.getUserById
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userController.deleteUserById
);

module.exports = router;
