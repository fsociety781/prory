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

  it("should return 400 when all parameter not filled", async () => {
    const updatedUser = {
      name: "",
      email: "",
      username: "",
      password: "",
      nik: "",
      phone: "",
      address: "",
    };

    const response = await request(app)
      .put("/admin/member/40")
      .send(updatedUser)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("400");
    expect(response.body.message).toBe("All parameter must be filled!");
  });

  it("should return 404 when member not found", async () => {
    const updatedUser = {
      name: "babu",
      email: "babia@example.com",
      username: "babia",
      password: "babu",
      nik: "1234567890123456",
      phone: "081234567890",
      address: "Jl. Babu No. 1",
    };

    const response = await request(app)
      .put("/admin/member/999")
      .send(updatedUser)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe("404");
    expect(response.body.message).toBe("Member with id 999 not found");
  });

  it("should return 400 when username and email already exists", async () => {
    const updatedUser = {
      name: "babu",
      email: "rehanmuhammadsaprudin787@gmail.com",
      username: "azmi",
      password: "babu",
      nik: "1234567890123456",
      phone: "081234567890",
      address: "Jl. Babu No. 1",
    };

    const response = await request(app)
      .put("/admin/member/13")
      .send(updatedUser)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("400");
    expect(response.body.message).toBe("Username and Email already exist");
  });

  it("should return 400 when username already exists", async () => {
    const updatedUser = {
      name: "babu",
      email: "rehanmuhammadsapruwweqdin787@gmail.com",
      username: "azmi",
      password: "babu",
      nik: "1234567890123456",
      phone: "081234567890",
      address: "Jl. Babu No. 1",
    };

    const response = await request(app)
      .put("/admin/member/13")
      .send(updatedUser)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("400");
    expect(response.body.message).toBe("Username has already been taken");
  });

  it("should return 400 when email already exists", async () => {
    const updatedUser = {
      name: "babu",
      email: "rehanmuhammadsaprudin787@gmail.com",
      username: "az",
      password: "babu",
      nik: "1234567890123456",
      phone: "081234567890",
      address: "Jl. Babu No. 1",
    };

    const response = await request(app)
      .put("/admin/member/13")
      .send(updatedUser)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("400");
    expect(response.body.message).toBe("Email has already been taken");
  });

  it("should return 200 when member updated successfully", async () => {
    const updatedUser = {
      name: "babu",
      email: "az@gmail.com",
      username: "az",
      password: "babu",
      nik: "1234567890123456",
      phone: "081234567890",
      address: "Jl. Babu No. 1",
    };

    const response = await request(app)
      .put("/admin/member/12")
      .send(updatedUser)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe("201");
    expect(response.body.message).toBe(
      "Member account has succesfully updated"
    );
  });
});
