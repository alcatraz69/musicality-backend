import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    let decodedData = jwt.verify(token, process.env.SECRET_KEY);
    if (decodedData) {
      req.user = decodedData;
      next();
    } else {
      res.status(401).json({
        success: false,
        error: {
          message: "Unauthorized",
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export default authenticate;
