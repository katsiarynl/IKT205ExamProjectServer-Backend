import request from "supertest";
import { app } from "../src/server";

describe("POST /forgetPassword endpoint", () => {
  test("It should return a 400 error if email is missing", async () => {
    const response = await request(app).post("/forgetPassword");
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("MessageError");
    expect(response.body.MessageError).toBe("Email is required!");
  });

  test("It should return a 404 error if user is not found for that email", async () => {
    const response = await request(app)
      .post("/forgetPassword")
      .send({ email: "yunus@example.com" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe(
      "There is no user record corresponding to the provided identifier."
    );
  });

  test("It should return a success message and status 200 if email is valid", async () => {
    const response = await request(app)
      .post("/forgetPassword")
      .send({ email: "yunus4141@example.com" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(
      "Link for password rest sent email Successfully!"
    );
  });
});
