import request from "supertest";
import { app } from "../src/server";

describe("POST /signUp endpoint", () => {
  test("It should return a 400 error if email and/or password is missing", async () => {
    const response = await request(app)
      .post("/signUp")
      .send({ email: "yunu41@example.com" });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Email and password are required!");
  });

  test("It should respond with a success message and user id if user signed up successfully", async () => {
    const response = await request(app)
      .post("/signUp")
      .send({ email: "yunus414142@example.com", password: "validpassword" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("User Registered Successfully");
    expect(response.body).toHaveProperty("id");
  });

  test("It should return a 400 error if email is already registered", async () => {
    const response = await request(app)
      .post("/signUp")
      .send({ email: "yunus4141@example.com", password: "validpassword" });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Firebase: Error (auth/email-already-in-use).");

  });

});