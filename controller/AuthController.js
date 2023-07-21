const express = require("express");
const AuthRouter = express.Router();

const jwt = require("jsonwebtoken");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const cookieParser = require("cookie-parser");
const prisma = require("../bin/prisma");
const jwtkey = process.env.JWT_KEY;

AuthRouter.use(cookieParser());
class AuthController {
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          status: "400",
          message: "Username and password must be filled!",
        });
      }

      const user = await prisma.user.findFirst({
        where: {
          username: {
            equals: username,
          },
        },
      });

      if (!user) {
        return res.status(401).json({
          status: "401",
          message: "Account not registered",
        });
      }

      const passwordMatch = compareSync(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({
          status: "401",
          message: "Incorrect username or password",
        });
      }

      if (!user.is_active) {
        return res.status(401).json({
          status: "401",
          message: "Your account has been deactivated",
        });
      }

      const token = jwt.sign(
        {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        },
        jwtkey,
        {
          expiresIn: "2h",
        }
      );

      const accessToken = await prisma.acces.create({
        data: {
          userId: user.id,
          name: "login token",
          token: token,
        },
      });

      return res.status(200).json({
        status: "200",
        name: user.name,
        message: "Successfully login",
        token: token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  static async logout(req, res) {
    const token = await prisma.acces.deleteMany({
      where: {
        token: req.token,
      },
    });

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "failed to logout",
      });
    }

    return res.status(200).json({
      success: true,
      message: "success logged out",
    });
  }
}

module.exports = AuthController;
