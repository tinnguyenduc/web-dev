const express = require("express");
const router = express.Router();

const authServices = require("../services/auth.service");

router.post("/register", authServices.register);
router.post("/login", authServices.login);
router.post("/logout", authServices.logout);

module.exports = router;
