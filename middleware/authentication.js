const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authentication = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next(new Unauthorised("Please provide the authorization token"));
  }

  const bearerToken = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(bearerToken, process.env.ACCESS_TOKEN_SECRET);
    const { name, email } = payload;

    req.user = { email, name };
    next();
  } catch (error) {
    if (error.message === "jwt expired") {
      return next(new UnauthenticatedError("Please login again", 403));
    }
    return next(new UnauthenticatedError("Unauthorised"));
  }
};

module.exports = authentication;
