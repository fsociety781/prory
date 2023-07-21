const request = require("supertest");
const app = require("../app");
const prisma = require("../bin/prisma");

describe("Test Member Get Procurement EndPoint", () => {
  let memberToken;
  beforeAll(async () => {
    const memberLoginRespone = await request(app).post("/login").send({
      username: "rehan",
      password: "rehan",
    });
    memberToken = memberLoginRespone.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("Test Get Profile", async () => {
    const response = await request(app)
      .get("/member/profile")
      .set("Authorization", `Bearer ${memberToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty("name");
    expect(response.body.data).toHaveProperty("nik");
    expect(response.body.data).toHaveProperty("phone");
    expect(response.body.data).toHaveProperty("address");
    expect(response.body.data).toHaveProperty("email");
    expect(response.body.data).toHaveProperty("username");
  });

  it("Test Get All Items", async () => {
    const response = await request(app)
      .get("/member/procurement")
      .set("Authorization", `Bearer ${memberToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Success get all");
  });

  it("Test Get All Items By Search Name", async () => {
    const response = await request(app)
      .get("/member/procurement")
      .query({ search: "kawasaki" })
      .set("Authorization", `Bearer ${memberToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Success search");
  });

  it("Test Get All Items By Search Category", async () => {
    const response = await request(app)
      .get("/member/procurement")
      .query({ categoryId: 2 })
      .set("Authorization", `Bearer ${memberToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Success category");
  });

  it("Test Get All Items By Search Name and Category", async () => {
    const response = await request(app)
      .get("/member/procurement")
      .query({ search: "kawasaki", categoryId: 2 })
      .set("Authorization", `Bearer ${memberToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Success search and category");
  });

  it("Test Get All Items By Search Status", async () => {
    const response = await request(app)
      .get("/member/procurement")
      .query({ status: "onprocess" })
      .set("Authorization", `Bearer ${memberToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Success status");
  });

  it("Test Get Detail Item", async () => {
    const response = await request(app)
      .get("/member/procurement/1")
      .set("Authorization", `Bearer ${memberToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("200");
    expect(response.body.message).toBe("Success Get Detail Item");
  });
});
