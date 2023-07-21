const request = require("supertest");
const app = require("../app");
const prisma = require("../bin/prisma");

describe("Update Member Endpoint", () => {
  let adminToken;
  beforeAll(async () => {
    const adminLoginRespone = await request(app).post("/login").send({
      username: "admin",
      password: "admin",
    });

    adminToken = adminLoginRespone.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return 400 when member not found", async () => {
    const response = await request(app)
      .delete("/admin/member/999")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe("404");
    expect(response.body.message).toBe("Member with id 999 not found");
  });

  it("should return 200 when member deleted", async () => {
    const response = await request(app)
      .delete("/admin/member/13")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("200");
    expect(response.body.message).toBe(
      "Member account has succesfully deleted"
    );
  });
});
