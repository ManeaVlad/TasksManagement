const express = require("express");
const router = express.Router();
const passport = require("passport");
const extractFile = require("../middleware/file");
const taskController = require("../controllers/tasks");

router.post(
  "",
  passport.authenticate("jwt", { session: false }),
  extractFile,
  taskController.createTask
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  extractFile,
  taskController.updateTask
);

router.get(
  "",
  passport.authenticate("jwt", { session: false }),
  taskController.getTasks
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  taskController.getTaskById
);

router.get(
  "/:project",
  passport.authenticate("jwt", { session: false }),
  taskController.getTasksByProject
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  taskController.deleteTaskById
);

router.patch(
  "/pending/:id",
  passport.authenticate("jwt", { session: false }),
  taskController.updateTaskByStatePending
);

router.patch(
  "/inProgress/:id",
  passport.authenticate("jwt", { session: false }),
  taskController.updateTaskByStateInProgress
);

router.patch(
  "/finished/:id",
  passport.authenticate("jwt", { session: false }),
  taskController.updateTaskByStateFinished
);

module.exports = router;
