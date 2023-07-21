const request = require("supertest");
const app = require("../app");
const prisma = require("../bin/prisma");

describe("Dashboard Member Endpoint", () => {
  let memberToken;
  beforeAll(async () => {
    const memberLoginResponse = await request(app).post("/login").send({
      username: "rehan",
      password: "rehan",
    });
    memberToken = memberLoginResponse.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("Test Get All Pocurement Dashboard Member", async () => {
    const response = await request(app)
      .get("/member")
      .set("Authorization", `Bearer ${memberToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("get data for dashboard");
  });

  it("Test Get All Pocurement Dashboard Member with page and filter", async () => {
    const response = await request(app)
      .get("/member?page=1&filter=perminggu")
      .set("Authorization", `Bearer ${memberToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("get data for dashboard");
  });

  it("Test Get All Pocurement Dashboard Member with filter perminggu", async () => {
    const response = await request(app)
      .get("/member?filter=perminggu")
      .set("Authorization", `Bearer ${memberToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("get data for dashboard");
  });

  it("Test Get All Pocurement Dashboard Member with filter perbulan", async () => {
    const response = await request(app)
      .get("/member?filter=perbulan")
      .set("Authorization", `Bearer ${memberToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("get data for dashboard");
  });

  it("Test Get All Pocurement Dashboard Member with filter pertahun", async () => {
    const response = await request(app)
      .get("/member?filter=pertahun")
      .set("Authorization", `Bearer ${memberToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("get data for dashboard");
  });
});
