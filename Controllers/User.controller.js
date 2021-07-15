import { User } from "../Models/User.model.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export const updateUser = async (req, res) => {
  if (req.body.data.password) {
    try {
      req.body.data.password = await bcrypt.hash(req.body.data.password, 12);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  try {
    const user = await User.findByIdAndUpdate(req.user.id, {
      $set: req.body.data,
    });
    res.status(200).json({ msg: "Account has been updated" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const deleteUser = async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const Currentuser = await User.findById(req.user.id)
      .populate("following", "_id profilePicture name")
      .exec();
    const { password, updatedAt, createdAt, __v, ...other } = Currentuser._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

export const getUser = async (req, res) => {
  try {
    const Currentuser = await User.findById(req.params.id)
      .populate("following", "_id profilePicture name")
      .exec();
    const { password, updatedAt, createdAt, __v, ...other } = Currentuser._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

export const followUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    const otherUserId = mongoose.Types.ObjectId(req.params.id);
    // console.log(mongoose.isValidObjectId(otherUserId));
    try {
      const otherUser = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);
      if (!otherUser.followers.includes(req.user.id)) {
        await otherUser.updateOne({ $push: { followers: req.user.id } });
        await currentUser.updateOne({
          $push: { following: otherUserId },
        });
        const { following } = await User.findById(req.user.id)
          .populate("following", "_id profilePicture name")
          .exec();
        res.status(200).json({ msg: "user has been followed", following });
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
};

export const unfollowUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    const otherUserId = mongoose.Types.ObjectId(req.params.id);
    try {
      const otherUser = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);
      if (otherUser.followers.includes(req.user.id)) {
        await otherUser.updateOne({ $pull: { followers: req.user.id } });
        await currentUser.updateOne({ $pull: { following: otherUserId } });
        const { following } = await User.findById(req.user.id)
          .populate("following", "_id profilePicture name")
          .exec();
        res.status(200).json({ msg: "user has been unfollowed", following });
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
};

export const getUserSuggestions = async (req, res) => {
  try {
    const Currentuser = await User.findById(req.user.id);
    const suggestions = await User.find({
      _id: {
        $nin: [...Currentuser.following.map((id) => id.toString())],
        $ne: req.user.id,
      },
    }).select("name profilePicture about");
    res.status(200).json(suggestions);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};
