import request from "supertest";
import { app } from "../src/server";

describe("Test the /login path", () => {
  test("It should redirect to the home page on successful login", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "kate@nedenes.com", password: "katepassword22222" });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe("/");
  });

  test("It should return an error message if login fails", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "kate@nedenes.com", password: "invalid-password" });
    expect(response.statusCode).toBe(302);
    expect(response.text).toContain("Found. Redirecting to /");
  });
});