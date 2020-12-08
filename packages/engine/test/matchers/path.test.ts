import matcher from "../../src/matchers/path";
import { Request } from "../../src/types";

test("matches a direct path /todo/1", () => {
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

test("matches a regex path: /todo/[0-9]", () => {
  const expRequest: Request = {
    path: "/todo/[0-9]",
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

test("matches path parameter", () => {
  const expRequest: Request = {
    path: "/todo/:todoId/doc/:docId",
    headers: {},
    method: "GET",
    pathParams: {
      todoId: "(1|2)",
      docId: "(xls|ppt)",
    },
  };

  const request1: Request = {
    path: "/todo/1/doc/xls",
    headers: {},
    method: "GET",
  };

  const request2: Request = {
    path: "/todo/2/doc/ppt",
    headers: {},
    method: "GET",
  };

  const request3: Request = {
    path: "/todo/3/doc/xls",
    headers: {},
    method: "GET",
  };

  expect(matcher(expRequest, request1)).toBe(true);
  expect(matcher(expRequest, request2)).toBe(true);
  expect(matcher(expRequest, request3)).toBe(false);
});

test("matches regex path parameter", () => {
  const expRequest: Request = {
    path: "/todo/:todoId",
    headers: {},
    method: "GET",
    pathParams: {
      todoId: ["[a-z]+"],
    },
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

  expect(matcher(expRequest, request1)).toBe(true);
  expect(matcher(expRequest, request2)).toBe(true);
  expect(matcher(expRequest, request3)).toBe(false);
});

test("matches query string parameters", () => {
  const expRequest: Request = {
    path: "/todo",
    headers: {},
    method: "GET",
    queryParams: {
      id: "[a-z]+",
      done: "true|false",
    },
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

  expect(matcher(expRequest, request1)).toBe(true);
  expect(matcher(expRequest, request2)).toBe(true);
  expect(matcher(expRequest, request3)).toBe(false);
});

test("matches query string parameters and path parameters", () => {
  const expRequest: Request = {
    path: "/todo/:id/owner/:ownerId",
    headers: {},
    method: "GET",
    pathParams: {
      id: "(12|13)",
      ownerId: "([4-8])",
    },
    queryParams: {
      done: "yes|no",
    },
  };

  const request1: Request = {
    path: "/todo/12/owner/4?done=yes",
    headers: {},
    method: "GET",
  };

  const request2: Request = {
    path: "/todo/12/owner/8",
    headers: {},
    method: "GET",
  };

  const request3: Request = {
    path: "/todo/14",
    headers: {},
    method: "GET",
  };

  const request4: Request = {
    path: "/todo/14/owner/5",
    headers: {},
    method: "GET",
  };

  expect(matcher(expRequest, request1)).toBe(true);
  expect(matcher(expRequest, request2)).toBe(false);
  expect(matcher(expRequest, request3)).toBe(false);
  expect(matcher(expRequest, request4)).toBe(false);
});

test("matches encoded url query", () => {
  const expRequest: Request = {
    path: "/doc",
    headers: {},
    method: "GET",
    queryParams: {
      url: "http://(.*).com",
    },
  };

  const request1: Request = {
    path: encodeURIComponent("/doc?url=http://yarn.com"),
    headers: {},
    method: "GET",
  };

  expect(matcher(expRequest, request1)).toBe(true);
});
