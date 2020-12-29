import { createServer } from "http";
import request from "supertest";
import createHandler from "../../src/handlers/index";

test("add a successful behavior", async () => {
  const requestHandler = createHandler({ config: { behaviors: [] } });

  const server = createServer(requestHandler);
  const res = await request(server)
    // @ts-ignore
    .post("/_/api/behaviors")
    .send([
      {
        name: "test behaviors",
        request: {
          path: "/tasks",
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
        response: {},
      },
    ]);

  expect(res.status).toBe(201);
});

test("fail adding behavior not an array", async () => {
  const requestHandler = createHandler({
    config: {
      behaviors: [
        {
          name: "test behaviors",
          request: { path: "/tasks", method: "GET" },
          response: {},
        },
      ],
    },
  });

  const server = createServer(requestHandler);
  const res = await request(server)
    // @ts-ignore
    .post("/_/api/behaviors")
    .send({
      name: "test behaviors",
      request: {
        path: "/tasks",
        method: "POST",
      },
      response: {},
    });

  expect(res.status).toBe(400);
  expect(res.body).toMatchInlineSnapshot(`
    Object {
      "actual": Array [],
      "expected": Array [
        "path",
      ],
      "message": "Request requires a path: expected {} to contain key 'path'",
    }
  `);
});

test("fail adding a non valid behavior", async () => {
  const requestHandler = createHandler({
    config: {
      behaviors: [
        {
          name: "test behaviors",
          request: { path: "/tasks", method: "GET" },
          response: {},
        },
      ],
    },
  });

  const server = createServer(requestHandler);
  const res = await request(server)
    // @ts-ignore
    .post("/_/api/behaviors")
    .send([
      {
        name: "test behaviors",
        request: { method: "POST" },
        response: {},
      },
    ]);

  expect(res.status).toBe(400);
  expect(res.body).toMatchInlineSnapshot(`
    Object {
      "actual": Array [
        "method",
      ],
      "expected": Array [
        "path",
      ],
      "message": "Request requires a path: expected { method: 'POST' } to contain key 'path'",
    }
  `);
});

test.skip("remove an behavior", async () => {
  const requestHandler = createHandler({
    config: {
      behaviors: [
        {
          id: "sample-behavior",
          name: "test behaviors",
          request: { path: "/tasks", method: "GET" },
          response: {},
        },
      ],
    },
  });

  const server = createServer(requestHandler);
  const res = await request(server)
    // @ts-ignore
    .delete("/_/api/behaviors?id=sample-behavior");

  expect(res.status).toBe(201);
  expect(res.body).toMatchInlineSnapshot(`
    Object {
      "message": "ok",
    }
  `);
});

test("retrieve all behaviors", async () => {
  const requestHandler = createHandler({
    config: {
      behaviors: [
        {
          id: "sample-behavior",
          name: "test behaviors",
          request: { path: "/tasks", method: "GET" },
          response: {},
        },
      ],
    },
  });

  const server = createServer(requestHandler);
  const res = await request(server)
    // @ts-ignore
    .get("/_/api/behaviors");

  expect(res.status).toBe(200);
  expect(res.body).toMatchInlineSnapshot(`
    Array [
      Object {
        "id": "sample-behavior",
        "limit": "unlimited",
        "name": "test behaviors",
        "request": Object {
          "method": "GET",
          "path": "/tasks",
        },
        "response": Object {},
      },
    ]
  `);
});

test("uses files as response", async () => {
  const requestHandler = createHandler({
    config: {
      behaviors: [
        {
          name: "test",
          request: {
            path: "/todos",
          },
          response: {
            headers: {
              "Content-Type": "application/json",
            },
            file: "fixtures/todos.json",
          },
        },
      ],
    },
  });

  const server = createServer(requestHandler);
  const res = await request(server)
    // @ts-ignore
    .get("/todos");

  expect(res.body).toMatchInlineSnapshot(`
    Array [
      Object {
        "id": 2,
        "text": "read from file",
      },
      Object {
        "id": 3,
        "text": "from todos.json",
      },
    ]
  `);
});

test("handles missing files gracefully", async () => {
  const requestHandler = createHandler({
    config: {
      behaviors: [
        {
          name: "test",
          request: {
            path: "/todos",
          },
          response: {
            headers: {
              "Content-Type": "application/json",
            },
            file: "fixtures/non_existing_file.json",
          },
        },
      ],
    },
  });

  const server = createServer(requestHandler);
  const res = await request(server)
    // @ts-ignore
    .get("/todos");

  expect(res.body).toMatchInlineSnapshot(`
    Object {
      "message": "fixtures/non_existing_file.json can not be found on the server",
    }
  `);
});

test("matches request body", async () => {
  const requestHandler = createHandler({
    config: {
      behaviors: [
        {
          name: "test",
          request: {
            path: "/todos",
            method: "POST",
            body: {
              name: "John Doe",
            },
          },
          response: {
            headers: {
              "Content-Type": "application/json",
            },
            file: "fixtures/todos.json",
          },
        },
      ],
    },
  });

  const server = createServer(requestHandler);
  const res = await request(server)
    // @ts-ignore
    .post("/todos")
    .send({ name: "John Doe" });

  expect(res.body).toMatchInlineSnapshot(`
    Array [
      Object {
        "id": 2,
        "text": "read from file",
      },
      Object {
        "id": 3,
        "text": "from todos.json",
      },
    ]
  `);
});