const request = require("supertest");
const app = require("../app");
const prisma = require("../bin/prisma");

describe("Create Member Endpoint", () => {
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

  it("Create New Member", async () => {
    const newMemberData = {
      name: "Rehan Muhammad Saprudin",
      email: "egalas@gmail.com",
      nik: "1234567890123456",
      phone: "081234567890",
      address: "Jalan Raya",
      username: "egalas",
      password: "admin",
      role: "member",
      is_active: true,
    };

    const response = await request(app)
      .post("/admin/member", newMemberData)
      .send(newMemberData)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Member account successfully created");
  });

  it("Validate User Existing", async () => {
    const newMemberDataExis = {
      name: "Rehan Muhammad Saprudin",
      email: "abdul@gmail.com",
      nik: "1234567890123456",
      phone: "081234567890",
      address: "Jalan Raya",
      username: "abdul",
      password: "admin",
      role: "member",
      is_active: true,
    };

    const existingUsername = await prisma.user.findFirst({
      where: {
        OR: [{ username: newMemberDataExis.username }],
      },
    });

    const existingEmail = await prisma.user.findFirst({
      where: {
        OR: [{ email: newMemberDataExis.email }],
      },
    });

    if (existingEmail && existingUsername) {
      const response = await request(app)
        .post("/admin/member")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newMemberDataExis);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Username and Email already exist");
    }
  });

  it("Validate Username Existing", async () => {
    const UsernameExists = {
      name: "Rehan Muhammad Saprudin",
      email: "abdu@gmail.com",
      nik: "1234567890123456",
      phone: "081234567890",
      address: "Jalan Raya",
      username: "abdul",
      password: "admin",
      role: "member",
      is_active: true,
    };

    const existingUsername = await prisma.user.findFirst({
      where: {
        OR: [{ username: UsernameExists.username }],
      },
    });

    if (existingUsername) {
      const response = await request(app)
        .post("/admin/member")
        .send(UsernameExists)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Username has already been taken");
    }
  });

  it("Validate Email Existing", async () => {
    const EmailExists = {
      name: "Rehan Muhammad Saprudin",
      email: "abdu@gmail.com",
      nik: "1234567890123456",
      phone: "081234567890",
      address: "Jalan Raya",
      username: "abdul",
      password: "admin",
      role: "member",
      is_active: true,
    };

    const existingEmail = await prisma.user.findFirst({
      where: {
        OR: [{ email: EmailExists.email }],
      },
    });

    if (existingEmail) {
      const response = await request(app)
        .post("/admin/member")
        .send(EmailExists)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Email has already been taken");
    }
  });
});
