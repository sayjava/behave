import { create } from "../src/engine";
import { Expectation } from "../src/types";

test("validates expectation", () => {
  const exps: any[] = [
    {
      name: "sample",
      request: {},
      response: {},
    },
  ];

  const doCreate = () => create({ expectations: exps, config: {} });

  expect(doCreate).toThrowError();
});

test("match simple method request", () => {
  const expectations: Expectation[] = [
    {
      name: "sample1",
      request: {
        headers: {},
        path: "/todos",
        method: "GET",
      },
      response: {
        body: [{ id: 2, text: "get request" }],
      },
    },
    {
      name: "sample2",
      request: {
        method: "DELETE",
        headers: {},
        path: "/todos",
      },
      response: {
        body: [],
      },
    },
  ];

  const engine = create({ expectations, config: {} });

  const matched = engine.match({
    path: "/todos",
    method: "GET",
    headers: { host: "example.com" },
  });

  expect(matched).toMatchInlineSnapshot(`
    Array [
      Object {
        "name": "sample1",
        "request": Object {
          "headers": Object {},
          "method": "GET",
          "path": "/todos",
        },
        "response": Object {
          "body": Array [
            Object {
              "id": 2,
              "text": "get request",
            },
          ],
        },
      },
    ]
  `);
});

test("match headers request", () => {
  const expectations: Expectation[] = [
    {
      name: "sample1",
      request: {
        headers: {
          host: "example.com",
        },
        path: "/todos",
        method: "GET",
      },
      response: {
        body: [{ id: 2, text: "get request" }],
      },
    },
    {
      name: "sample2",
      request: {
        method: "DELETE",
        headers: {},
        path: "/todos",
      },
      response: {
        body: [],
      },
    },
  ];

  const engine = create({ expectations, config: {} });

  const matched = engine.match({
    path: "/todos",
    method: "GET",
    headers: { host: "example.com", "User-Agent": "node-js" },
  });

  expect(matched).toMatchInlineSnapshot(`
    Array [
      Object {
        "name": "sample1",
        "request": Object {
          "headers": Object {
            "host": "example.com",
          },
          "method": "GET",
          "path": "/todos",
        },
        "response": Object {
          "body": Array [
            Object {
              "id": 2,
              "text": "get request",
            },
          ],
        },
      },
    ]
  `);
});

test("match json body request", () => {
  const expectations: Expectation[] = [
    {
      name: "sample1",
      request: {
        headers: {},
        path: "/todos",
        method: "GET",
      },
      response: {
        body: [{ id: 2, text: "get request" }],
      },
    },
    {
      name: "sample2",
      request: {
        method: "POST",
        headers: {},
        path: "/todos",
        body: {
          id: 3,
          text: "new post",
        },
      },
      response: {
        body: [],
      },
    },
  ];

  const engine = create({ expectations, config: {} });

  const matched = engine.match({
    path: "/todos",
    method: "POST",
    headers: { host: "example.com" },
    body: { id: 3, text: "new post" },
  });

  expect(matched).toMatchInlineSnapshot(`
    Array [
      Object {
        "name": "sample2",
        "request": Object {
          "body": Object {
            "id": 3,
            "text": "new post",
          },
          "headers": Object {},
          "method": "POST",
          "path": "/todos",
        },
        "response": Object {
          "body": Array [],
        },
      },
    ]
  `);
});

test("match string body request", () => {
  const expectations: Expectation[] = [
    {
      name: "sample1",
      request: {
        headers: {},
        path: "/todos",
        method: "GET",
      },
      response: {
        body: [{ id: 2, text: "get request" }],
      },
    },
    {
      name: "sample2",
      request: {
        method: "POST",
        headers: {},
        path: "/todos",
        body: "[0-9]th todo",
      },
      response: {
        body: [],
      },
    },
  ];

  const engine = create({ expectations, config: {} });

  const matched = engine.match({
    path: "/todos",
    method: "POST",
    headers: { host: "example.com" },
    body: "5th todo",
  });

  expect(matched).toMatchInlineSnapshot(`
    Array [
      Object {
        "name": "sample2",
        "request": Object {
          "body": "[0-9]th todo",
          "headers": Object {},
          "method": "POST",
          "path": "/todos",
        },
        "response": Object {
          "body": Array [],
        },
      },
    ]
  `);
});
