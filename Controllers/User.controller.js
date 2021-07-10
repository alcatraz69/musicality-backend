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

export const getCurrentUser = async (req, res) => {
  const user = req.user;
  try {
    const Currentuser = await User.findById(user.id);
    const { password, updatedAt, createdAt, __v, ...other } = Currentuser._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

export const getUser = async (req, res) => {
  try {
    const Currentuser = await User.findById(req.params.id);
    const { password, updatedAt, createdAt, __v, ...other } = Currentuser._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

export const followUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    try {
      const otherUser = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);
      if (!otherUser.followers.includes(req.user.id)) {
        await otherUser.updateOne({ $push: { followers: req.user.id } });
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
  if (req.user.id !== req.params.id) {
    try {
      const otherUser = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);
      if (otherUser.followers.includes(req.user.id)) {
        await otherUser.updateOne({ $pull: { followers: req.user.id } });
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

export const getUserFriends = async (req, res) => {
  const user = req.user;
  try {
    const Currentuser = await User.findById(user.id);
    const friends = await User.find({
      _id: { $in: Currentuser.following },
    });
    res.status(200).json(friends);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};
