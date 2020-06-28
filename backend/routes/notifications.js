const express = require("express");
const router = express.Router();
const passport = require("passport");
const notificationsController = require("../controllers/notifications");

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  notificationsController.updateNotification
);

router.get(
  "",
  passport.authenticate("jwt", { session: false }),
  notificationsController.getNotifications
);

module.exports = router;
