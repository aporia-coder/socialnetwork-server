const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(403).json({
        success: false,
        error: "User Not Authenticated",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log(err);
  }
};
