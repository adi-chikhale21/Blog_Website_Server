const {
  createCommentController,
  deleteCommentController,
} = require("../Controller/commentController");
const requiredUser = require("../middlewares/requiredUser");

const Router = require("express").Router();

Router.post("/", requiredUser, createCommentController);
Router.delete("/", requiredUser, deleteCommentController);

module.exports = Router;
