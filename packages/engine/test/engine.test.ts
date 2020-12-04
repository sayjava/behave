import { create, Engine } from "../src/engine";
import { Behavior, Request } from "../src/types";

test("validates expectation", () => {
  const exps: any[] = [
    {
      name: "sample",
      request: {},
      response: {},
    },
  ];

  const doCreate = () => create({ behaviors: exps, config: {} });

  expect(doCreate).toThrowError();
});

test("match simple method request", () => {
  const behaviors: Behavior[] = [
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

  const engine = create({ behaviors, config: {} });

  const matched = engine.match({
    path: "/todos",
    method: "GET",
    headers: { host: "example.com" },
  });

  expect(matched).toMatchInlineSnapshot(`
    Array [
      Object {
        "id": "exp1",
        "limit": "unlimited",
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
  const behaviors: Behavior[] = [
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

  const engine = create({ behaviors, config: {} });

  const matched = engine.match({
    path: "/todos",
    method: "GET",
    headers: { host: "example.com", "User-Agent": "node-js" },
  });

  expect(matched).toMatchInlineSnapshot(`
    Array [
      Object {
        "id": "exp1",
        "limit": "unlimited",
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
  const behaviors: Behavior[] = [
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

  const engine = create({ behaviors, config: {} });

  const matched = engine.match({
    path: "/todos",
    method: "POST",
    headers: { host: "example.com" },
    body: { id: 3, text: "new post" },
  });

  expect(matched).toMatchInlineSnapshot(`
    Array [
      Object {
        "id": "exp2",
        "limit": "unlimited",
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
  const behaviors: Behavior[] = [
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

  const engine = create({ behaviors, config: {} });

  const matched = engine.match({
    path: "/todos",
    method: "POST",
    headers: { host: "example.com" },
    body: "5th todo",
  });

  expect(matched).toMatchInlineSnapshot(`
    Array [
      Object {
        "id": "exp2",
        "limit": "unlimited",
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
  const behaviors: Behavior[] = [
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
      limit: 2,
    },
  ];

  const request: Request = {
    path: "/todos",
    method: "GET",
    headers: {},
  };

  const engine = create({ behaviors, config: {} });

  engine.match(request);
  engine.match(request);
  const lastMatch = engine.match(request);

  expect(lastMatch).toMatchInlineSnapshot(`Array []`);
});

test("multiple expectation matches", () => {
  const behaviors: Behavior[] = [
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
      limit: 1,
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
      limit: "unlimited",
    },
  ];

  const engine = create({ behaviors, config: {} });

  const request: Request = {
    path: "/todos",
    method: "GET",
    headers: {},
  };

  const successExp = engine.match(request);
  expect(successExp).toMatchInlineSnapshot(`
    Array [
      Object {
        "id": "exp1",
        "limit": 1,
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
        "id": "exp2",
        "limit": "unlimited",
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
        "id": "exp2",
        "limit": "unlimited",
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

test("Behavior: add results in error", () => {
  const engine = new Engine([]);
  const add = () => engine.addBehavior({} as any);
  expect(add).toThrowError(
    "expected {} to contain keys 'name', 'request', and 'response'"
  );
});

test("Behavior: add", () => {
  const engine = new Engine([]);
  const add = () =>
    engine.addBehavior({
      id: "new",
      name: "base expectation",
      request: { path: "/hello" },
      response: {},
    });
  expect(add).not.toThrow();
  expect(engine.behaviors).toMatchInlineSnapshot(`
    Array [
      Object {
        "id": "new",
        "limit": "unlimited",
        "name": "base expectation",
        "request": Object {
          "path": "/hello",
        },
        "response": Object {},
      },
    ]
  `);
});

test("Behavior: remove", () => {
  const engine = new Engine([]);
  engine.addBehavior({
    id: "new",
    name: "base expectation",
    request: { path: "/hello" },
    response: {},
  });
  engine.removeBehavior("new");
  expect(engine.behaviors).toMatchInlineSnapshot(`Array []`);
});

test(`Clear all records`, () => {
  const behaviors: Behavior[] = [
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
      limit: 2,
    },
  ];

  const request: Request = {
    path: "/todos",
    method: "GET",
    headers: {},
  };

  const engine = create({ behaviors, config: {} });

  engine.match(request);
  engine.match(request);
  engine.clearAll();

  expect(engine.records).toMatchInlineSnapshot(`Array []`);
  expect(engine.behaviors).toMatchInlineSnapshot(`Array []`);
});
