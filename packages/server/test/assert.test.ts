import bodyParser from "body-parser";
import express from "express";
import request from "supertest";
import middleware from "../src/middlewares/express";

test("return a 406  for empty requests", async () => {
  const app = express();
  app.use(bodyParser.json());
  middleware({ app, config: { behaviors: [] } });

  // @ts-ignore
  const res = await request(app).put("/_/api/requests/assert");
  expect(res.status).toBe(406);
  expect(res.body).toMatchInlineSnapshot(`
    Object {
      "message": "Behaviors must be an array",
    }
  `);
});

test("return the error from a failed existence verification", async () => {
  const app = express();
  app.use(bodyParser.json());
  middleware({ app, config: { behaviors: [] } });

  const res = await request(app)
    // @ts-ignore
    .put("/_/api/requests/assert")
    .send([
      {
        request: {
          path: "/tasks",
          method: "POST",
        },
      },
      {
        request: {
          path: "/tasks",
          method: "GET",
        },
      },
    ]);

  expect(res.status).toBe(406);
  expect(res.body).toMatchInlineSnapshot(`
    Array [
      Object {
        "actual": 0,
        "expected": 1,
        "message": "Expected to have received POST:/tasks at least 1 times but was received 0 times",
        "records": Array [],
      },
      Object {
        "actual": 0,
        "expected": 1,
        "message": "Expected to have received GET:/tasks at least 1 times but was received 0 times",
        "records": Array [],
      },
    ]
  `);
});

test("return accepted http 202", async () => {
  const app = express();
  app.use(bodyParser.json());

  middleware({
    app,
    config: {
      behaviors: [
        {
          name: "test expectations",
          request: { path: "/tasks", method: "GET" },
          response: {},
        },
        {
          name: "test expectations",
          request: { path: "/tasks", method: "POST" },
          response: {},
        },
      ],
    },
  });

  await request(app).post("/tasks").send();
  await request(app).get("/tasks").send();

  const res = await request(app)
    // @ts-ignore
    .put("/_/api/requests/assert")
    .send([
      {
        request: {
          path: "/tasks",
          method: "POST",
        },
      },
      {
        request: {
          path: "/tasks",
          method: "GET",
        },
      },
    ]);

  expect(res.status).toBe(202);
});

test("return error for unmatched existence", async () => {
  const app = express();
  app.use(bodyParser.json());

  middleware({
    app,
    config: {
      behaviors: [
        {
          name: "test expectations",
          request: { path: "/tasks", method: "GET" },
          response: {},
        },
        {
          name: "test expectations",
          request: { path: "/tasks", method: "POST" },
          response: {},
        },
      ],
    },
  });

  await request(app).get("/tasks").send();
  await request(app).get("/tasks").send();

  const res = await request(app)
    // @ts-ignore
    .put("/_/api/requests/assert")
    .send([
      {
        request: {
          path: "/tasks",
          method: "POST",
        },
        count: {
          atMost: 0,
        },
      },
      {
        request: {
          path: "/tasks",
          method: "GET",
        },
        count: {
          atLeast: 1,
        },
      },
    ]);

  expect(res.status).toBe(406);
  expect(res.body).toMatchInlineSnapshot(`
    Array [
      Object {
        "actual": 0,
        "expected": 1,
        "message": "Expected to have received POST:/tasks at least 1 times but was received 0 times",
        "records": Array [],
      },
    ]
  `);
});
