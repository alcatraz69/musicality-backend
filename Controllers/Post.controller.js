import { User } from "../Models/User.model.js";
import { Post } from "../Models/Post.model.js";

export const createPost = async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.user.id)) {
      await post.updateOne({
        $push: { likes: req.user.id },
      });
      res.status(200).json({ msg: "The post has been liked" });
    } else {
      await post.updateOne({
        $pull: { likes: req.user.id },
      });
      res.status(200).json({ msg: "The post has been disliked" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const timelinePost = async (req, res) => {
  const user = req.user;
  try {
    const currentUser = await User.findById(user.id);
    const userPosts = await Post.find({ user: currentUser._id })
      .populate("user", "_id profilePicture name")
      .sort("-createdAt")
      .exec();
    const timelinePosts = await Post.find({
      user: { $in: currentUser.following },
    })
      .populate("user", "_id profilePicture name")
      .exec();
    res.json(userPosts.concat(...timelinePosts));
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

export const userPost = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.id })
      .populate("user", "_id profilePicture name")
      .sort("-createdAt")
      .exec();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
};
