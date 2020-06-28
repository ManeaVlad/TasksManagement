const express = require("express");
const router = express.Router();
const passport = require("passport");
const extractFile = require("../middleware/file");
const projectController = require("../controllers/projects");

router.post(
  "",
  passport.authenticate("jwt", { session: false }),
  extractFile,
  projectController.createProject
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  extractFile,
  projectController.updateProject
);

router.get(
  "",
  passport.authenticate("jwt", { session: false }),
  projectController.getProjects
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  projectController.getProjectById
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  projectController.deleteProjectById
);

module.exports = router;
