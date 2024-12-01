const express = require("express");
const { register, login, logout, logoutAll } = require("../controllers//userController.js");

const router = express.Router();

router.get("/register", (req, res) => res.render("register")); // Render Register Page
router.post("/register", register);

router.get("/login", (req, res) => res.render("login")); // Render Login Page
router.post("/login", login);

router.get("/logout", logout); // Logout from current device
router.get("/logout-all", logoutAll); // Logout from all devices

module.exports = router;
