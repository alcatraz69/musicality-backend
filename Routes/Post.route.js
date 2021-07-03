import express from "express";
const router = express.Router();
import {
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPost,
  timelinePost,
} from "../Controllers/Post.controller.js";

router.get("/getPost/:id", getPost);
router.post("/createPost", createPost);
router.put("/updatePost/:id", updatePost);
router.put("/likePost/:id", likePost);
router.delete("/deletePost/:id", deletePost);
router.get("/getTimelinePosts", timelinePost);

export default router;
