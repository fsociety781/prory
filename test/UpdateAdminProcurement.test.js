const request = require("supertest");
const app = require("../app");
const prisma = require("../bin/prisma");

describe("Test Update Endpoint Procurement Admin", () => {
  let adminToken;
  beforeAll(async () => {
    const adminLoginResponse = await request(app).post("/login").send({
      username: "admin",
      password: "admin",
    });
    adminToken = adminLoginResponse.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("Update Data Procurement Invalid Status", async () => {
    const response = await request(app)
      .patch("/admin/procurement/5")
      .send({ status: "invalid" })
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe("404");
    expect(response.body.message).toBe(
      "Only choose available status: onprocess, approve, reject"
    );
  });

  it("should return 400 if item has already been processed", async () => {
    const response = await request(app)
      .patch("/admin/procurement/1")
      .send({
        status: "approve",
      })
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe("400");
    expect(response.body.message).toBe("Item already processed");
  });

  it("should return 400 if reason is not provided", async () => {
    const response = await request(app)
      .patch("/admin/procurement/18")
      .send({
        status: "reject",
      })
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe("400");
    expect(response.body.message).toBe("Reason is required for reject status");
  });

  it("should return 200 if item is updated to approve", async () => {
    const response = await request(app)
      .patch("/admin/procurement/7")
      .send({
        status: "approve",
      })
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("200");
    expect(response.body.message).toBe(
      "Successfully change item status to approve and send Email Notification to raihanmuhammadsaprudin898@gmail.com"
    );
  });

  it("should return 200 if item is updated to reject", async () => {
    const response = await request(app)
      .patch("/admin/procurement/8")
      .send({
        status: "reject",
        reason: "Item is not available",
      })
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("200");
    expect(response.body.message).toBe(
      "Successfully change item status to reject and send Email Notification to raihanmuhammadsaprudin898@gmail.com"
    );
  });
});
