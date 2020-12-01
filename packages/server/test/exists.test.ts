import express from "express";
import { Engine } from "behave-engine";
import bodyParser from "body-parser";
import routes from "../src/middlewares/express";
import request from "supertest";

test("return a 202  for empty requests", async () => {
  const app = express();
  app.use(bodyParser.json());
  routes(app, new Engine([]));

  // @ts-ignore
  const res = await request(app).put("/_/api/verify/exists");
  expect(res.status).toBe(406);
  expect(res.body).toMatchInlineSnapshot(`
    Object {
      "message": "Verifications are empty",
    }
  `);
});

test("return the error from a failed existence verification", async () => {
  const app = express();
  app.use(bodyParser.json());
  routes(app, new Engine([]));

  const res = await request(app)
    // @ts-ignore
    .put("/_/api/verify/exists")
    .send({
      verifications: [
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
      ],
    });

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
  const engine = new Engine([
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
  ]);

  routes(app, engine);

  engine.match({ path: "/tasks", method: "POST" });
  engine.match({ path: "/tasks", method: "GET" });

  const res = await request(app)
    // @ts-ignore
    .put("/_/api/verify/exists")
    .send({
      verifications: [
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
      ],
    });

  expect(res.status).toBe(202);
});

test("return error for unmatched existence", async () => {
  const app = express();
  app.use(bodyParser.json());
  const engine = new Engine([
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
  ]);

  routes(app, engine);

  engine.match({ path: "/tasks", method: "GET" });
  engine.match({ path: "/tasks", method: "GET" });

  const res = await request(app)
    // @ts-ignore
    .put("/_/api/verify/exists")
    .send({
      verifications: [
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
      ],
    });

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
