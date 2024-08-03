const User = require("../Model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { error, success } = require("../utils/responseWrapper");

const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.send(error(400, "Please fill required field"));
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.send(error(400, "You already have an account"));
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashpassword });

    const accessToken = generateAccessToken({
      _id: newUser._id,
    });

    const refreshToken = generateRefreshToken({
      _id: newUser._id,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return res.send(success(201, { accessToken }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send(error(400, "Please fill required field"));
    }

    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.send(error(409, "User is not registered"));
    }
    const matched = await bcrypt.compare(password, findUser.password);

    if (!matched) {
      return res.send(error(403, "Wrong Password"));
    }

    const accessToken = generateAccessToken({
      _id: findUser._id,
    });

    const refreshToken = generateRefreshToken({
      _id: findUser._id,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return res.send(success(201, { accessToken }));
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};

const generateRefreshAccessToken = (req, res) => {
  cookies = req.cookies;

  if (!cookies.jwt) {
    return res.send(error(500, "Refresh token in cookie is expired"));
  }

  refreshToken = cookies.jwt;

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );

    _id = decoded._id;

    const accessToken = generateAccessToken({ _id });
    return res.send(success(201, { accessToken }));
  } catch (e) {
    console.log(e);
    return res.send(error(403, "Invalid refresh key"));
  }
};

const logoutController = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });

    return res.send(success(200, "Logout successfully"));
  } catch (e) {
    return res.send(error(403, e.message));
  }
};

//internal functions
const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "15d",
    });

    return token;
  } catch (e) {
    console.log(e);
  }
};

const generateRefreshToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "1y",
    });

    return token;
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  signupController,
  loginController,
  generateRefreshAccessToken,
  logoutController,
};
