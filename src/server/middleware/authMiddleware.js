import jwt from "jsonwebtoken";
const secrete = process.env.JWT_SUPER_SEACRETE || "superGupthKey";
const requireAuth = (req, res, next) => {
  const authHeader = req.get("Authorization");
  const token = authHeader ? authHeader.split(" ")[1] : null;
  if (token) {
    jwt.verify(token, secrete, (err, tokenData) => {
      if (err) {
        return res.status(401).json({ message: err.message, status: "error" });
      } else {
        res.locals.tokenData = tokenData;
        next();
      }
    });
  } else {
    res.status(401).json({
      message: "token not found",
      status: "error",
    });
  }
};
export { requireAuth };
