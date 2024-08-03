const {
  signupController,
  loginController,
  generateRefreshAccessToken,
  logoutController,
} = require("../Controller/authController");

const Router = require("express").Router();

Router.post("/signup", signupController);
Router.post("/login", loginController);
Router.get("/refresh", generateRefreshAccessToken);
Router.post("/logout", logoutController);

module.exports = Router;
