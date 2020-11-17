import matcher from "../../src/matchers/body";
import { Request } from "../../src/types";

test("matches a string body", () => {
  const expRequest: Request = {
    path: "/todo/1",
    headers: {},
    body: "A simple body counts at [0-9]+",
    method: "POST",
  };

  const request: Request = {
    path: "/todo/1",
    headers: {},
    method: "POST",
    body: "A simple body counts at 10",
  };

  expect(matcher(expRequest, request)).toBe(true);
});

test("matches an empty body", () => {
  const expRequest: Request = {
    path: "/todo/1",
    headers: {},
    method: "POST",
  };

  const request: Request = {
    path: "/todo/1",
    headers: {},
    method: "POST",
    body: "A simple body counts at 10",
  };

  expect(matcher(expRequest, request)).toBe(true);
});
