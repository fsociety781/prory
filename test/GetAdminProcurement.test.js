const request = require("supertest");
const app = require("../app");
const prisma = require("../bin/prisma");

describe("Test Endpoint Procurement Admin", () => {
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

  it("Get All Data Procurement", async () => {
    const response = await request(app)
      .get("/admin/procurement")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Succes get all");
    expect(response.body.data).toBeDefined();
  });

  it("Search Items by Name and Category", async () => {
    const response = await request(app)
      .get("/admin/procurement")
      .query({ search: "kawasaki", categoryId: 2 })
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Succes search and category");
    expect(response.body.data).toBeDefined();
    expect(response.body.page).toBeDefined();
    expect(response.body.totalPages).toBeDefined();
    expect(response.body.totalCount).toBeDefined();
  });

  it("Get All Data Procurement By Search name", async () => {
    const response = await request(app)
      .get("/admin/procurement")
      .query({ search: "kawasaki" })
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Succes search");
    expect(response.body.data).toBeDefined();
    expect(response.body.page).toBeDefined();
    expect(response.body.totalPages).toBeDefined();
    expect(response.body.totalCount).toBeDefined();
  });

  it("Get All Data Procurement By Search categoryId", async () => {
    const response = await request(app)
      .get("/admin/procurement")
      .query({ categoryId: 1 })
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Succes category");
    expect(response.body.data).toBeDefined();
    expect(response.body.page).toBeDefined();
    expect(response.body.totalPages).toBeDefined();
    expect(response.body.totalCount).toBeDefined();
  });

  it("Get All Data Procurement By Search status", async () => {
    const response = await request(app)
      .get("/admin/procurement")
      .query({ status: "onprocess" })
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Succes status");
    expect(response.body.data).toBeDefined();
    expect(response.body.page).toBeDefined();
    expect(response.body.totalPages).toBeDefined();
    expect(response.body.totalCount).toBeDefined();
  });
});

describe("Test Endpoint Procurement Admin By Id detail item", () => {
  let adminToken;
  beforeAll(async () => {
    const adminLoginResponse = await request(app).post("/login").send({
      username: "admin",
      password: "admin",
    });

    adminToken = adminLoginResponse.body.token;
  });

  it("Get Detail items By Id", async () => {
    const response = await request(app)
      .get("/admin/procurement/1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Succes Get Detail Item");
    expect(response.body.data).toBeDefined();
  });
});
