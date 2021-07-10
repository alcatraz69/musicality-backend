import express from "express";
const router = express.Router();
import {
  updateUser,
  deleteUser,
  getUser,
  followUser,
  unfollowUser,
  getUserFriends,
  getCurrentUser,
} from "../Controllers/User.controller.js";
import authenticate from "../Middleware/authenticate.js";

router.get("/getcurrentuser", authenticate, getCurrentUser);
router.get("/getuser/:id", authenticate, getUser);
router.get("/getuserfriends", authenticate, getUserFriends);
router.put("/updateuser/:id", updateUser);
router.put("/followuser/:id", authenticate, followUser);
router.put("/unfollowuser/:id", authenticate, unfollowUser);
router.delete("/deleteuser/:id", deleteUser);

export default router;
