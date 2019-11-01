const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");
const postController = require("../controllers/posts");

router.post("", checkAuth, extractFile, postController.createPost);

router.patch("/:id", checkAuth, extractFile, postController.updatePost);

router.get("", postController.getPosts);

router.get("/:id", postController.getPostById);

router.delete("/:id", checkAuth, postController.deletePostById);

module.exports = router;
