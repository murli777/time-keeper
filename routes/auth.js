const express = require("express");
const router = express.Router();

const { signUp, login, logout } = require("../controllers/auth");
const { credentialValidator } = require("../middleware");

router.route("/login").post(credentialValidator, login);
router.route("/signup").post(credentialValidator, signUp);
router.route("/logout").get(logout);

module.exports = router;
