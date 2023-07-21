async function verifyTokenMember(req, res, next) {
  if (req.user.role != "member") {
    return res.status(403).json({
      status: "403",
      message: "Access Denied! Access member only",
    });
  }
  next();
}
module.exports = verifyTokenMember;
