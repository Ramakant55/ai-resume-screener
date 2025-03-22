const jwt = require("jsonwebtoken");

exports.isAdmin = async (req, res, next) => {
  if(req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

exports.authVerifyToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};