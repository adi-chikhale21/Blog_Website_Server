const {
  getMyPost,
  deletemyProfile,
  getUserPost,
  getMyProfile,
  updateUserProfile,
  getUserProfile,
} = require("../Controller/userController");
const requiredUser = require("../middlewares/requiredUser");

const Router = require("express").Router();

Router.get("/getmypost", requiredUser, getMyPost);
Router.get("/userpost", requiredUser, getUserPost);
Router.delete("/", requiredUser, deletemyProfile);
Router.get("/getMyProfile", requiredUser, getMyProfile);
Router.put("/", requiredUser, updateUserProfile);
Router.post("/getuserprofile", requiredUser, getUserProfile);

module.exports = Router;
