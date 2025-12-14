const { client } = require("../../db/connect");
const updateUser = require("../../db/repositories/user/updateUser");

const logout = async (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken) {
    return res.status(204).json({ msg: "No content" });
  }

  const userCollection = client.db("jobs").collection("users");

  const user = await userCollection.findOne({
    refreshToken: cookies.refreshToken,
  });

  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(204).json({ msg: "No content" });
  }

  await updateUser(
    { refreshToken: cookies.refreshToken },
    { refreshToken: "" }
  );

  res.clearCookie("refreshToken", {
    httpOnly: true,
    maxAge: 14 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({
    success: true,
    msg: "Logged out successfully",
  });
};

module.exports = logout;