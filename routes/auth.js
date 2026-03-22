const express = require("express");
const router = express.Router();

const { signUp, login, logout } = require("../controllers/auth/index");
const { validateSignupBody, validateLoginBody } = require("../middleware/userValidators");

router.route("/login").post(validateLoginBody, login);
router.route("/signup").post(validateSignupBody, signUp);
router.route("/logout").get(logout);

module.exports = router;
