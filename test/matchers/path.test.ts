import url from "../../src/matchers/path";
import { Expectation, Request } from "../../src/types";

test("matches a direct path /todo/1", () => {
  const expectation: Expectation = {
    name: "simple path",
    request: {
      path: "/todo/1",
      headers: {},
      method: "GET",
    },
    response: {},
  };

  const request: Request = {
    path: "/todo/1",
    headers: {},
    method: "GET",
  };

  expect(url(expectation, request)).toBe(true);
});

test("matches a regex path: /todo/[0-9]", () => {
  const expectation: Expectation = {
    name: "simple path",
    request: {
      path: "/todo/[0-9]",
      headers: {},
      method: "GET",
    },
    response: {},
  };

  const request: Request = {
    path: "/todo/1",
    headers: {},
    method: "GET",
  };

  expect(url(expectation, request)).toBe(true);
});

test.skip("negative path match: !/todo/[0-9", () => {
  const expectation: Expectation = {
    name: "simple path",
    request: {
      path: "!/todo/[0-9]",
      headers: {},
      method: "GET",
    },
    response: {},
  };

  const request: Request = {
    path: "/todo/123",
    headers: {},
    method: "GET",
  };

  expect(url(expectation, request)).toBe(true);
});

test("matches path parameter", () => {
  const expectation: Expectation = {
    name: "simple path",
    request: {
      path: "/todo/{todoId}",
      headers: {},
      method: "GET",
      pathParams: {
        todoId: [1, 2],
      },
    },
    response: {},
  };

  const request1: Request = {
    path: "/todo/1",
    headers: {},
    method: "GET",
  };

  const request2: Request = {
    path: "/todo/2",
    headers: {},
    method: "GET",
  };

  const request3: Request = {
    path: "/todo/3",
    headers: {},
    method: "GET",
  };

  expect(url(expectation, request1)).toBe(true);
  expect(url(expectation, request2)).toBe(true);
  expect(url(expectation, request3)).toBe(false);
});

test("matches regex path parameter", () => {
  const expectation: Expectation = {
    name: "simple path",
    request: {
      path: "/todo/{todoId}",
      headers: {},
      method: "GET",
      pathParams: {
        todoId: ["[a-z]+"],
      },
    },
    response: {},
  };

  const request1: Request = {
    path: "/todo/take-out-trash",
    headers: {},
    method: "GET",
  };

  const request2: Request = {
    path: "/todo/paint-the-room",
    headers: {},
    method: "GET",
  };

  const request3: Request = {
    path: "/todo/43",
    headers: {},
    method: "GET",
  };

  expect(url(expectation, request1)).toBe(true);
  expect(url(expectation, request2)).toBe(true);
  expect(url(expectation, request3)).toBe(false);
});
