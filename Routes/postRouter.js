const {
  createPostController,
  likeOrUnlike,
  updatePostController,
  deletePost,
  getAllPosts,
  getPostController,
} = require("../Controller/postController");
const requiredUser = require("../middlewares/requiredUser");

const Router = require("express").Router();

Router.post("/", requiredUser, createPostController);
Router.post("/like", requiredUser, likeOrUnlike);
Router.put("/", requiredUser, updatePostController);
Router.delete("/", requiredUser, deletePost);
Router.post("/getallposts", requiredUser, getAllPosts);
Router.post("/getpost", requiredUser, getPostController);

module.exports = Router;
