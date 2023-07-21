var express = require("express");
var admin = express.Router();
const AuthMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");
//import Controller
const DashboardController = require("../../controller/Admin/DashboardController");
const MemberController = require("../../controller/Admin/MemberController");
const ProcurementController = require("../../controller/Admin/ProcurementController");
const EmailVerifyController = require("../../controller/EmailVerifyController");

//Router admin untuk memanipulasi akun member
admin.get("/admin", AuthMiddleware, adminMiddleware, DashboardController.index);

admin.get(
  "/admin/member",
  AuthMiddleware,
  adminMiddleware,
  MemberController.getMembers
);

admin.get(
  "/admin/member/:id",
  AuthMiddleware,
  adminMiddleware,
  MemberController.getMemberById
);

admin.post(
  "/admin/member",
  AuthMiddleware,
  adminMiddleware,
  MemberController.storeMember
);

admin.get("/email/verify/:token", EmailVerifyController.verifyEmail);

admin.put(
  "/admin/member/:id",
  AuthMiddleware,
  adminMiddleware,
  MemberController.updateMember
);
admin.delete(
  "/admin/member/:id",
  AuthMiddleware,
  adminMiddleware,
  MemberController.deleteMember
);

//Router admin untuk memanipulasi data Item Pengajuan
admin.get(
  "/admin/procurement",
  AuthMiddleware,
  adminMiddleware,
  ProcurementController.getAllItems
);

admin.get(
  "/admin/procurement/:id",
  AuthMiddleware,
  adminMiddleware,
  ProcurementController.getItemId
);
admin.patch(
  "/admin/procurement/:id",
  AuthMiddleware,
  adminMiddleware,
  ProcurementController.updateStatus
);

module.exports = admin;
