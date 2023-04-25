import request from "supertest";
import { app } from "../src/server";

describe("GET /isAuthenticated endpoint", () => {
  test("It should return a 401 error if Authorization header is missing", async () => {
    const response = await request(app).get("/isAuthenticated");
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Unauthorized");
  });


});
