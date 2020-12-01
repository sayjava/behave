import matcher from "../../src/matchers/headers";
import { Expectation, Request } from "../../src/types";

test("matches a subset header keys", () => {
  const expRequest: Request = {
    path: "/todo/1",
    headers: {
      Accept: "application/json",
      "Cache-Control": "no-cache",
    },
    method: "GET",
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

  expect(matcher(expRequest, request)).toBe(true);
});

test("matches headers values", () => {
  const expRequest: Request = {
    path: "/todo/1",
    headers: {
      Accept: "application/json",
      "x-behave-version": "[0-9]+",
    },
    method: "GET",
  };

  const request: Request = {
    path: "/todo/1",
    headers: {
      Accept: "application/json",
      HOST: "example.com",
      "x-behave-version": "1",
    },
    method: "GET",
  };

  expect(matcher(expRequest, request)).toBe(true);
});

test("empty headers", () => {
  const expRequest: Request = {
    path: "/todo/1",
    headers: {},
    method: "GET",
  };

  const request: Request = {
    path: "/todo/1",
    headers: {},
    method: "GET",
  };

  expect(matcher(expRequest, request)).toBe(true);
});
