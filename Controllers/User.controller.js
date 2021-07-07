import { User } from "../Models/User.model.js";
import bcrypt from "bcryptjs";

export const updateUser = async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      try {
        req.body.password = await bcrypt.hash(req.body.password, 12);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json({ msg: "Account has been updated" });
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
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

export const getUser = async (req, res) => {
  console.log("here");
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, createdAt, __v, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const followUser = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const otherUser = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!otherUser.followers.includes(req.body.userId)) {
        await otherUser.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json("user has been followed");
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
  if (req.body.userId !== req.params.id) {
    try {
      const otherUser = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (otherUser.followers.includes(req.body.userId)) {
        await otherUser.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
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
