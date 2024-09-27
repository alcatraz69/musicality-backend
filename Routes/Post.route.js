import express from "express";
const router = express.Router();
import {
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPost,
  timelinePost,
  userPost,
} from "../Controllers/Post.controller.js";
import authenticate from "../Middleware/authenticate.js";

router.get("/getPost/:id", getPost);
router.post("/createPost", createPost);
router.put("/updatePost/:id", updatePost);
router.put("/likePost/:id", authenticate, likePost);
router.delete("/deletePost/:id", deletePost);
router.get("/getuserpost/:id", authenticate, userPost);
router.get("/getTimelinePosts", authenticate, timelinePost);

export default router;
