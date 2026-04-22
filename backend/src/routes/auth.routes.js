const express = require("express")
const { registerUser, loginUser } = require("../Controller/auth.controller")

const router = express.Router();

// authentication endpoints
router.post("/register", registerUser)
router.post("/login", loginUser)

module.exports = router;