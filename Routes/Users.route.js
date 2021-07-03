import express from "express";
const router = express.Router();
import { updateUser, deleteUser } from "../Controllers/User.controller.js";

router.put("/updateuser/:id", updateUser);
router.delete("/deleteuser/:id", deleteUser);
export default router;
