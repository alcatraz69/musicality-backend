import express from "express";
const router = express.Router();
import {
  updateUser,
  deleteUser,
  getUser,
  followUser,
  unfollowUser,
} from "../Controllers/User.controller.js";

router.get("/getuser/:id", getUser);
router.put("/updateuser/:id", updateUser);
router.put("/followuser/:id", followUser);
router.put("/unfollowuser/:id", unfollowUser);
router.delete("/deleteuser/:id", deleteUser);

export default router;
