import matcher from "../../src/matchers/body";
import { Expectation, Request } from "../../src/types";

test("matches a string body", () => {
  const expectation: Expectation = {
    name: "simple body",
    request: {
      path: "/todo/1",
      headers: {},
      body: "A simple body counts at [0-9]+",
      method: "POST",
    },
    response: {},
  };

  const request: Request = {
    path: "/todo/1",
    headers: {},
    method: "POST",
    body: "A simple body counts at 10",
  };

  expect(matcher(expectation, request)).toBe(true);
});
