const Post = require("../Model/post");
const User = require("../Model/user");
const cloudinary = require("cloudinary").v2;
const { mapPostOutput } = require("../utils/utils");

const { success, error } = require("../utils/responseWrapper");

const createPostController = async (req, res) => {
  try {
    const { title, description, postImg } = req.body;
    const owner = req._id;

    if (!description || !title || !postImg) {
      return res.send(error(400, "All field are required"));
    }

    const cloudImg = await cloudinary.uploader.upload(postImg, {
      folder: "postImg",
    });
    const user = await User.findById(owner);

    const post = await Post.create({
      owner,
      title,
      description,
      image: {
        url: cloudImg.secure_url,
        publicId: cloudImg.public_id,
      },
    });

    user.posts.push(post._id);
    await user.save();

    res.send(success(201, { post }));
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};

const likeOrUnlike = async (req, res) => {
  try {
    const { postId } = req.body;
    const currUser = req._id;

    const post = await Post.findById(postId).populate("owner");

    if (!post) {
      return res.send(error(404, "Post not found"));
    }

    if (post.likes.includes(currUser)) {
      const index = post.likes.indexOf(currUser);
      post.likes.splice(index, 1);
    } else {
      post.likes.push(currUser);
    }

    await post.save();
    return res.send(success(200, { post: mapPostOutput(post, req._id) }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const updatePostController = async (req, res) => {
  try {
    const { postId, description } = req.body;
    const currUser = req._id;

    if (!description) {
      return res.send(error(400, "All field are required"));
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.send(error(404, "Post not found"));
    }

    if (post.owner.toString() !== currUser) {
      return res.send(error(404, "Only owner can update post"));
    }

    if (description) {
      post.description = description;
    }

    await post.save();
    return res.send(success(200, { post }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const currUser = req._id;

    const post = await Post.findById(postId);
    const user = await User.findById(currUser);

    if (!post) {
      return res.send(error(404, "Post not found"));
    }

    if (post.owner.toString() !== currUser) {
      return res.send(error(404, "Only owner can delete post"));
    }

    const index = user.posts.indexOf(postId);
    user.posts.splice(index, 1);

    await user.save();
    await post.deleteOne();

    res.send(success(200, "Post deleted successfully"));
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};

const getAllPosts = async (req, res) => {
  try {
    const allposts = await Post.find().populate("owner");
    console.log(allposts);

    const posts = allposts
      .map((item) => mapPostOutput(item, req._id))
      .reverse();

    res.send(success(200, { posts }));
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};

const getPostController = async (req, res) => {
  try {
    const { postId } = req.body;
    const post = await Post.findById(postId)
      .populate("owner")
      .populate({
        path: "comments",
        populate: {
          path: "owner",
        },
      });
    console.log(post);

    return res.send(success(200, { post: mapPostOutput(post, req._id) }));
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};

module.exports = {
  createPostController,
  likeOrUnlike,
  updatePostController,
  deletePost,
  getAllPosts,
  getPostController,
};
