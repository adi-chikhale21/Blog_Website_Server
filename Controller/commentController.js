const User = require("../Model/user");
const Comment = require("../Model/comment");
const Post = require("../Model/post");
const { error, success } = require("../utils/responseWrapper");

const createCommentController = async (req, res) => {
  try {
    const { comment, postId } = req.body;
    const owner = req._id;

    console.log(comment);

    if (!comment) {
      return res.send(error(400, "All field are required"));
    }

    const post = await Post.findById(postId);
    const user = await User.findById(owner);

    const review = await Comment.create({
      owner,
      comment,
      name: user.name,
    });

    post.comments.push(review._id);
    await post.save();

    res.send(success(201, { review, post }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const deleteCommentController = async (req, res) => {
  try {
    const { commentId, postId } = req.body;
    const currUser = req._id;

    const comment = await Comment.findById(commentId);
    const post = await Post.findById(postId);

    console.log(commentId);

    if (!comment) {
      return res.send(error(404, "You did not comment"));
    }

    if (comment.owner.toString() !== currUser) {
      return res.send(error(404, "Only owner can delete comment"));
    }

    const index = post.comments.indexOf(commentId);
    post.comments.splice(index, 1);

    await post.save();
    await comment.deleteOne();

    res.send(success(200, "Comment deleted successfully"));
  } catch (e) {
    return res.send(error(200, e.message));
  }
};

module.exports = { createCommentController, deleteCommentController };
