import express from "express";
import cors from "cors";
import initializeDbConnection from "./Database/DBconnection.js";
import authRoute from "./Routes/Auth.route.js";
import userRoute from "./Routes/Users.route.js";
import postRoute from "./Routes/Post.route.js";

const app = express();
app.use(express.json());
app.use(cors());

initializeDbConnection();

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/post", postRoute);
app.use("/", (req, res) => {
  res.json("Musicality Server");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server Running");
});
