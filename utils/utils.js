var ta = require("time-ago");

const mapPostOutput = (post, userId) => {
  return {
    _id: post._id,
    title: post.title,
    description: post.description,
    image: post.image,
    owner: {
      _id: post.owner._id,
      name: post.owner.name,
      avatar: post.owner.avatar,
      bio: post.owner.bio,
    },
    likesCount: post.likes.length,
    isLiked: post.likes.includes(userId),
    timeAgo: ta.ago(post.createdAt),
    comments: (post.comments || []).map((comment) => ({
      _id: comment._id,
      comment: comment.comment,
      owner: comment.owner
        ? {
            _id: comment.owner._id,
            name: comment.owner.name,
            avatar: comment.owner.avatar,
          }
        : {},
      createdAt: comment.createdAt,
    })),
  };
};

module.exports = { mapPostOutput };
