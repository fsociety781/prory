const request = require("supertest");
const app = require("../app");
const prisma = require("../bin/prisma");

describe("Get Members Endpoint", () => {
  let adminToken;

  beforeAll(async () => {
    // Lakukan autentikasi sebagai admin dan dapatkan token admin
    const adminLoginResponse = await request(app).post("/login").send({
      username: "admin", // Ganti dengan email admin yang valid
      password: "admin", // Ganti dengan password admin yang valid
    });

    adminToken = adminLoginResponse.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("Get All Members", async () => {
    const response = await request(app)
      .get("/admin/member")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Get Members");
    expect(response.body.data).toBeDefined();
    // Lakukan pengujian lain sesuai dengan respons yang diharapkan
  });

  it("Get All Members with page", async () => {
    const response = await request(app)
      .get("/admin/member")
      .query({ page: 0 })
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Get Members");
    expect(response.body.data).toBeDefined();
    // Lakukan pengujian lain sesuai dengan respons yang diharapkan
  });

  it("Get All Members Not Found ", async () => {
    const response = await request(app)
      .get("/admin/member")
      .query({ page: 1000 })
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Member Not Found");
    // Lakukan pengujian lain sesuai dengan respons yang diharapkan
  });

  it("Get data Members By search", async () => {
    const response = await request(app)
      .get("/admin/member")
      .query({ search: "raihanmuhammadsaprudin898@gmail.com" })
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Get Members");
    expect(response.body.data).toBeDefined();
    // Lakukan pengujian lain sesuai dengan respons yang diharapkan
  });

  it("Get data Members By search name Not Found", async () => {
    const response = await request(app)
      .get("/admin/member")
      .query({ search: "rehan1" })
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Member Not Found");
  });

  it("Get data Members By search username Not Found", async () => {
    const response = await request(app)
      .get("/admin/member")
      .query({ search: "rehan12" })
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Member Not Found");
  });

  it("Get data Members By search email Not Found", async () => {
    const response = await request(app)
      .get("/admin/member")
      .query({ search: "rehandkjasdhak@gmail.com" })
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Member Not Found");
  });

  it("Geta Detail Member", async () => {
    const response = await request(app)
      .get("/admin/member/3")
      .set("Authorization", `Bearer ${adminToken}`);

    const member = await prisma.user.findUnique({
      where: {
        id: 3,
      },
      select: {
        name: true,
        nik: true,
        phone: true,
        address: true,
        username: true,
        email: true,
      },
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("200");
    expect(response.body.message).toBe(
      "Success get member " + member.name + ""
    );
    expect(response.body.data).toBeDefined();
    // Lakukan pengujian lain sesuai dengan respons yang diharapkan
  });

  it("Only admin can acces endpoint - Unauthorized", async () => {
    const response = await request(app)
      .get("/admin/member")
      .set(
        "Authorization",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozLCJ1c2VybmFtZSI6InJlaGFuIiwiZW1haWwiOiJyZWhhbm11aGFtbWFkc2FwcnVkaW43ODdAZ21haWwuY29tIiwicm9sZSI6Im1lbWJlciJ9LCJpYXQiOjE2ODYyNzY2ODIsImV4cCI6MTY4NjI4Mzg4Mn0.LzKmqGsFRoKrBsKb4mMpK-eg12p5WktCTqLNQ3D6wU4"
      );

    expect(response.status).toBe(401);
    // Lakukan pengujian lain sesuai dengan respons yang diharapkan
  });
});
