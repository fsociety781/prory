const request = require("supertest");
const app = require("../app");
const prisma = require("../bin/prisma");

describe("Dashboard Admin", () => {
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

  it("Test Dashboard Admin", async () => {
    const response = await request(app)
      .get("/admin")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("get data for dashboard");
  });

  it("Test Dashboard Admin with filter perminggu", async () => {
    const response = await request(app)
      .get("/admin?filter=perminggu")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("get data for dashboard");
  });

  it("Test Dashboard Admin with filter perbulan", async () => {
    const response = await request(app)
      .get("/admin?filter=perbulan")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("get data for dashboard");
  });

  it("Test Dashboard Admin with filter pertahun", async () => {
    const response = await request(app)
      .get("/admin?filter=pertahun")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("get data for dashboard");
  });

  it("Test Dashboard Admin with page and filter", async () => {
    const response = await request(app)
      .get("/admin?page=1&filter=pertahun")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("get data for dashboard");
  });
});
