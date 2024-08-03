const User = require("../Model/user");
const Post = require("../Model/post");
const { success, error } = require("../utils/responseWrapper");
const Comment = require("../Model/comment");
const { mapPostOutput } = require("../utils/utils");
const cloudinary = require("cloudinary").v2;

const getMyPost = async (req, res) => {
  try {
    const currUser = req._id;
    const posts = await Post.find({
      owner: currUser,
    }).populate("likes");

    if (posts.length < 1) {
      return res.send(error(404, "You dont have any post"));
    }

    res.send(success(200, posts));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getUserPost = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.send(error(400, "User Id id required"));
    }

    const posts = await Post.find({
      owner: userId,
    }).populate("likes");

    if (posts.length < 1) {
      return res.send(error(404, "User dont have any post"));
    }

    res.send(success(200, posts));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const deletemyProfile = async (req, res) => {
  try {
    const userId = req._id;
    const user = await User.findById(userId);

    //delete all posts
    await Post.deleteMany({
      owner: userId,
    });

    //delete likes from post
    const allposts = await Post.find();
    console.log(allposts);

    allposts.forEach(async (post) => {
      const index = post.likes.indexOf(userId);
      post.likes.splice(index, 1);

      await post.save();
    });

    //delete Comment
    await Comment.deleteMany({
      owner: userId,
    });

    //delete Comment from posts undone remember
    // allposts.forEach(async (post) => {
    //   const index = post.comments.indexOf(userId);
    //   post.likes.splice(index, 1);

    //   await post.save();
    // });

    await user.deleteOne();

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });

    res.send(success(200, "User successfully deleted"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req._id);
    res.send(success(200, { user }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, bio, userImg } = req.body;

    const user = await User.findById(req._id);

    if (name) {
      user.name = name;
    }

    if (bio) {
      user.bio = bio;
    }
    if (userImg) {
      const cloudImg = await cloudinary.uploader.upload(userImg, {
        folder: "profileImg",
      });

      user.avatar = {
        url: cloudImg.secure_url,
        publicId: cloudImg.public_id,
      };
    }

    await user.save();
    return res.send(success(200, { user }));
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.body.userId;

    console.log(userId);

    const user = await User.findById(userId).populate({
      path: "posts",
      populate: {
        path: "owner",
      },
    });

    const fullPost = user.posts;
    const posts = fullPost
      .map((item) => mapPostOutput(item, req._id))
      .reverse();

    return res.send(success(200, { ...user._doc, posts }));
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};
module.exports = {
  getMyPost,
  getUserPost,
  deletemyProfile,
  getMyProfile,
  updateUserProfile,
  getUserProfile,
};
