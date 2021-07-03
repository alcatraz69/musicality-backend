import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../Models/User.model.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (!userExists) return res.status(400).json({ msg: "user doesnt exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userExists.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ msg: "invalid credentials" });

    const token = jwt.sign(
      { email: userExists.email, id: userExists._id },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.status(200).json({ result: userExists, token, msg: "logged in" });
  } catch (err) {
    console.log(err);
  }
};

export const register = async (req, res) => {
  const { name, email, password, cpassword } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(409).json({ msg: "user already exists" });

    if (password !== cpassword)
      return res.status(400).json({ msg: "password doesnt match" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.status(200).json({ result: user, token });
  } catch (error) {
    console.log(error);
  }
};
