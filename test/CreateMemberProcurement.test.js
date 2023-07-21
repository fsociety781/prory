const request = require("supertest");
const app = require("../app");
const prisma = require("../bin/prisma");

describe("Test Member Create Procurement EndPoint", () => {
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

  it("Test Create Procurement", async () => {
    const CreateProcurement = {
      name: "Kawasaki Ninja 250",
      description: "Motor Sport",
      price: 50000000,
      quantity: 1,
      categoryId: 1,
      url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.kawasaki.com%2Fen-us%2Fmotorcycle%2Fninja%2Fninja-250r&psig=AOvVaw0QZ4Z3Z3Z3Z3Z3Z3Z3Z3Z3&ust=1629788020008000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCJjQ4ZqHgvICFQAAAAAdAAAAABAD",
      total: 50000000,
      duedate: "2021-08-24T00:00:00.000Z",
    };

    const response = await request(app)
      .post("/member/procurement")
      .send(CreateProcurement)
      .set("Authorization", `Bearer ${memberToken}`);
    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe("201");
    expect(response.body.message).toBe(
      "Item has ben succesfully sent to admin"
    );
  }, 10000);

  it("Test Create Procurement with empty field", async () => {
    const CreateProcurement = {
      name: "",
      description: "",
      price: "",
      quantity: "",
      categoryId: "",
      url: "",
      total: "",
      duedate: "",
    };

    const response = await request(app)
      .post("/member/procurement")
      .send(CreateProcurement)
      .set("Authorization", `Bearer ${memberToken}`);
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("400");
    expect(response.body.message).toBe("All parameter must be filled!");
  });
});
