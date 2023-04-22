import request from "supertest";
import { app } from "../src/server";
describe("Test the root path", () => {
  test("It should response the GET method", (done) => {
    request(app)
      .get("/restraunts")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
