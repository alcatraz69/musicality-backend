import jwt from "jsonwebtoken";

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decodedData;
    } else {
      decodedData = jwt.decode(token);
      req.user = decodedData;
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export default authenticate;
