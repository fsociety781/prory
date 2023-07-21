const express = require("express");
const member = express.Router();
//import middleware
const AuthMiddleware = require("../../middleware/authMiddleware");
const MemberMiddleware = require("../../middleware/memberMiddleware");
//import Controller
const ProcurementController = require("../../controller/Member/ProcurementController");
const DashBoaradController = require("../../controller/Member/DashboardController");

member.get(
  "/member",
  AuthMiddleware,
  MemberMiddleware,
  DashBoaradController.index
);
member.get(
  "/member/profile",
  AuthMiddleware,
  MemberMiddleware,
  ProcurementController.getProfile
);
member.get(
  "/member/procurement",
  AuthMiddleware,
  MemberMiddleware,
  ProcurementController.getItems
);

member.get(
  "/member/procurement/:id",
  AuthMiddleware,
  MemberMiddleware,
  ProcurementController.getItemId
);

member.post(
  "/member/procurement",
  AuthMiddleware,
  MemberMiddleware,
  ProcurementController.storeItem
);

module.exports = member;
