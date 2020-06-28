const Notification = require("../models/notifications");

exports.updateNotification = (req, res, next) => {
  Notification.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        view: true,
      },
    }
  )
    .then((result) => {
      res.status(200).json({ message: "Updated succesfully!" });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Edit failed!",
      });
    });
};

exports.getNotifications = (req, res, next) => {
  const user = req.user.google.id === "" ? req.user.local : req.user.google;
  const notificationQuery = Notification.find({
    assignee: user.userName,
    view: false,
  });
  let fetchedNotifications;
  notificationQuery
    .then((documents) => {
      fetchedNotifications = documents;
      return Notification.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Notifications fetched successfully.",
        notification: fetchedNotifications,
        maxNotifications: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching notifications failed.",
      });
    });
};
