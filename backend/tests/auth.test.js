const request = require("supertest");
const app = require("../server");
const db = require("../config/db");

// Basic integration tests for auth flow

describe("Auth Flow", () => {
  let email = `test${Date.now()}@example.com`;
  let refreshToken;
  test("register", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({
        username: "tester" + Date.now(),
        email,
        password: "Passw0rd!",
        firstname: "T",
        lastname: "User",
      });
    expect(res.status).toBe(201);
    expect(res.body.tokens.access.token).toBeDefined();
    expect(res.body.tokens.refresh.token).toBeDefined();
  });
  test("login", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email, password: "Passw0rd!" });
    expect(res.status).toBe(200);
    refreshToken = res.body.tokens.refresh.token;
  });
  test("refresh", async () => {
    const res = await request(app)
      .post("/api/users/refresh-token")
      .send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body.tokens.access.token).toBeDefined();
    expect(res.body.tokens.refresh.token).toBeDefined();
  });
});
