var express = require("express");
var router = express.Router();

//import Controller
const AuthController = require("../../controller/AuthController");
const AuthMiddleware = require("../../middleware/authMiddleware");

router.post("/login", AuthController.login);
router.post("/logout", AuthMiddleware, AuthController.logout);

module.exports = router;
