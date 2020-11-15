import matcher from "../../src/matchers/headers";
import { Expectation, Request } from "../../src/types";

test("matches a subset header keys", () => {
  const expectation: Expectation = {
    name: "simple path",
    request: {
      path: "/todo/1",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
      method: "GET",
    },
    response: {},
  };

  const request: Request = {
    path: "/todo/1",
    headers: {
      Accept: "application/json",
      "Cache-Control": "no-cache",
      Host: "example.com",
    },
    method: "GET",
  };

  expect(matcher(expectation, request)).toBe(true);
});

test("matches headers values", () => {
  const expectation: Expectation = {
    name: "simple path",
    request: {
      path: "/todo/1",
      headers: {
        Accept: "application/json",
        "x-flyt-version": "[0-9]+",
      },
      method: "GET",
    },
    response: {},
  };

  const request: Request = {
    path: "/todo/1",
    headers: {
      Accept: "application/json",
      HOST: "example.com",
      "x-flyt-version": "1",
    },
    method: "GET",
  };

  expect(matcher(expectation, request)).toBe(true);
});
