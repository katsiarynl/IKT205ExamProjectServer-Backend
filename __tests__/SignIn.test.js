import request from "supertest";
import { app } from "../src/server";

describe("POST /signIn endpoint", () => {
  test("It should return a 400 error if email and/or password is missing", async () => {
    const response = await request(app)
      .post("/signIn")
      .send({ email: "yunusyy@example.com" });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Email and Password is required!");
  });

  test("It should return a 400 error if the user credentials are invalid", async () => {
    const response = await request(app)
      .post("/signIn")
      .send({ email: "yunusyy@example.com", password: "invalidpassword" });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe(
      "Firebase: Error (auth/wrong-password)."
    );
  });

  test("It should respond with an access token if user signed in successfully", async () => {
    const response = await request(app)
      .post("/signIn")
      .send({ email: "yunusyy@example.com", password: "validpassword" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
  });

 

});
