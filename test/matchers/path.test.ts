import matcher from "../../src/matchers/path";
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

  expect(matcher(expectation, request)).toBe(true);
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

  expect(matcher(expectation, request)).toBe(true);
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

  expect(matcher(expectation, request)).toBe(true);
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

  expect(matcher(expectation, request1)).toBe(true);
  expect(matcher(expectation, request2)).toBe(true);
  expect(matcher(expectation, request3)).toBe(false);
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

  expect(matcher(expectation, request1)).toBe(true);
  expect(matcher(expectation, request2)).toBe(true);
  expect(matcher(expectation, request3)).toBe(false);
});

test("query string parameters", () => {
  const expectation: Expectation = {
    name: "simple path",
    request: {
      path: "/todo",
      headers: {},
      method: "GET",
      queryParams: {
        id: ["[a-z]+"],
        done: ["true", "false"],
      },
    },
    response: {},
  };

  const request1: Request = {
    path: "/todo?id=take&done=true",
    headers: {},
    method: "GET",
  };

  const request2: Request = {
    path: "/todo?id=pain&done=false",
    headers: {},
    method: "GET",
  };

  const request3: Request = {
    path: "/todo?id=43&done=true",
    headers: {},
    method: "GET",
  };

  expect(matcher(expectation, request1)).toBe(true);
  expect(matcher(expectation, request2)).toBe(true);
  expect(matcher(expectation, request3)).toBe(false);
});

test("query string parameters and path parameters", () => {
  const expectation: Expectation = {
    name: "simple path",
    request: {
      path: "/todo/{id}",
      headers: {},
      method: "GET",
      pathParams: {
        id: [12, 13],
      },
      queryParams: {
        done: ["yes", "no"],
      },
    },
    response: {},
  };

  const request1: Request = {
    path: "/todo/12?done=yes",
    headers: {},
    method: "GET",
  };

  const request2: Request = {
    path: "/todo/13?done=no",
    headers: {},
    method: "GET",
  };

  const request3: Request = {
    path: "/todo/14",
    headers: {},
    method: "GET",
  };

  expect(matcher(expectation, request1)).toBe(true);
  expect(matcher(expectation, request2)).toBe(true);
  expect(matcher(expectation, request3)).toBe(false);
});
