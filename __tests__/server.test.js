import request from "supertest";
import { app } from "../src/routes";
jest.useFakeTimers();
describe("Test the root path", () => {
  test("It should response the GET method", () => {
    request(app)
      .get("/restraunts")
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });
});
