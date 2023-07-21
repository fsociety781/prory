const request = require("supertest");
const app = require("../app");
const prisma = require("../bin/prisma");

describe("login", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return 200 and a valid JWT token on successful login", async () => {
    // Persiapkan data pengguna
    const userData = {
      username: "admin",
      password: "admin",
    };

    // Simulasikan permintaan ke endpoint login
    const response = await request(app)
      .post("/login")
      .send(userData)
      .expect(200);

    // Verifikasi respons
    expect(response.body).toHaveProperty("token");
    expect(response.body.token).toBeTruthy();

    const token = response.body.token;

    // Simulasikan permintaan ke endpoint logout dengan menggunakan token
    const responses = await request(app)
      .post("/logout")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("should return 400 on login with empty username and password", async () => {
    // Persiapkan data pengguna dengan kredensial yang tidak valid
    const userData = {
      username: "",
      password: "",
    };

    // Simulasikan permintaan ke endpoint login
    const response = await request(app)
      .post("/login")
      .send(userData)
      .expect(400);

    // Verifikasi respons
    expect(response.body).toEqual({
      message: "Username and password must be filled!",
      status: "400",
    });
  });

  it("should return 401 on login with Your account has been deactivated", async () => {
    // Persiapkan data pengguna dengan kredensial yang tidak valid
    const userData = {
      username: "azmi",
      password: "azmi",
    };

    // Simulasikan permintaan ke endpoint login
    const response = await request(app)
      .post("/login")
      .send(userData)
      .expect(401);

    // Verifikasi respons
    expect(response.body).toEqual({
      message: "Your account has been deactivated",
      status: "401",
    });
  });

  it("should return 401 on login with Incorrect username or password", async () => {
    // Persiapkan data pengguna dengan kredensial yang tidak valid
    const userData = {
      username: "admin",
      password: "admin123",
    };

    // Simulasikan permintaan ke endpoint login
    const response = await request(app)
      .post("/login")
      .send(userData)
      .expect(401);

    // Verifikasi respons
    expect(response.body).toEqual({
      message: "Incorrect username or password",
      status: "401",
    });
  });

  it("should return 401 on login with Account not registered", async () => {
    // Persiapkan data pengguna dengan kredensial yang tidak valid
    const userData = {
      username: "admin123",
      password: "admin123",
    };

    // Simulasikan permintaan ke endpoint login
    const response = await request(app)
      .post("/login")
      .send(userData)
      .expect(401);

    // Verifikasi respons
    expect(response.body).toEqual({
      message: "Account not registered",
      status: "401",
    });
  });
});

describe("logout", () => {
  it("should return 200 on successful logout", async () => {
    const userData = {
      username: "rehan",
      password: "rehan",
    };

    const loginResponse = await request(app)
      .post("/login")
      .send(userData)
      .expect(200);

    const token = loginResponse.body.token;
    const response = await request(app)
      .post("/logout")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual({
      success: true,
      message: "success logged out",
    });
  });
});
