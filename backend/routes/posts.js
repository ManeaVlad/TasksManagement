const express = require("express");
const router = express.Router();
const passport = require("passport");
const extractFile = require("../middleware/file");
const postController = require("../controllers/posts");

router.post("",  passport.authenticate("jwt", { session: false }), extractFile, postController.createPost);

router.patch("/:id",  passport.authenticate("jwt", { session: false }), extractFile, postController.updatePost);

router.get("", postController.getPosts);

router.get("/:id", postController.getPostById);

router.delete("/:id",  passport.authenticate("jwt", { session: false }), postController.deletePostById);

module.exports = router;
