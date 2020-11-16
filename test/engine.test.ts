import { create } from "../src/engine";
import { Expectation, Request } from "../src/types";

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
      id: "exp1",
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
        "count": "unlimited",
        "id": "exp1",
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
      id: "exp1",
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
      id: "exp2",
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
        "count": "unlimited",
        "id": "exp1",
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
      id: "exp1",
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
      id: "exp2",
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
        "count": "unlimited",
        "id": "exp2",
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
      id: "exp1",
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
      id: "exp2",
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
        "count": "unlimited",
        "id": "exp2",
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

test("matched 2 times only", () => {
  const expectations: Expectation[] = [
    {
      id: "exp1",
      name: "sample1",
      request: {
        headers: {},
        path: "/todos",
        method: "GET",
      },
      response: {
        body: [{ id: 2, text: "get request" }],
      },
      count: 2,
    },
  ];

  const request: Request = {
    path: "/todos",
    method: "GET",
    headers: {},
  };

  const engine = create({ expectations, config: {} });

  engine.match(request);
  const secondMatch = engine.match(request);
  engine.match(request);
  engine.match(request);
  const lastMatch = engine.match(request);

  expect(secondMatch).toMatchInlineSnapshot(`
    Array [
      Object {
        "count": 2,
        "id": "exp1",
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
  expect(lastMatch).toMatchInlineSnapshot(`Array []`);
});

test("multiple expectation matches", () => {
  const expectations: Expectation[] = [
    {
      id: "exp1",
      name: "sample1",
      request: {
        headers: {},
        path: "/todos",
        method: "GET",
      },
      response: {
        statusCode: 200,
      },
      count: 1,
    },
    {
      id: "exp2",
      name: "sample2",
      request: {
        headers: {},
        path: "/todos",
        method: "GET",
      },
      response: {
        statusCode: 500,
      },
      count: "unlimited",
    },
  ];

  const engine = create({ expectations, config: {} });

  const request: Request = {
    path: "/todos",
    method: "GET",
    headers: {},
  };

  const successExp = engine.match(request);
  expect(successExp).toMatchInlineSnapshot(`
    Array [
      Object {
        "count": 1,
        "id": "exp1",
        "name": "sample1",
        "request": Object {
          "headers": Object {},
          "method": "GET",
          "path": "/todos",
        },
        "response": Object {
          "statusCode": 200,
        },
      },
      Object {
        "count": "unlimited",
        "id": "exp2",
        "name": "sample2",
        "request": Object {
          "headers": Object {},
          "method": "GET",
          "path": "/todos",
        },
        "response": Object {
          "statusCode": 500,
        },
      },
    ]
  `);

  const failExp = engine.match(request);
  expect(failExp).toMatchInlineSnapshot(`
    Array [
      Object {
        "count": 1,
        "id": "exp1",
        "name": "sample1",
        "request": Object {
          "headers": Object {},
          "method": "GET",
          "path": "/todos",
        },
        "response": Object {
          "statusCode": 200,
        },
      },
      Object {
        "count": "unlimited",
        "id": "exp2",
        "name": "sample2",
        "request": Object {
          "headers": Object {},
          "method": "GET",
          "path": "/todos",
        },
        "response": Object {
          "statusCode": 500,
        },
      },
    ]
  `);
});
