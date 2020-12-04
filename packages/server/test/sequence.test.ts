import { Engine } from "@sayjava/behave-engine";
import bodyParser from "body-parser";
import express from "express";
import request from "supertest";
import routes from "../src/middlewares/express";

test("return a 406  for empty requests", async () => {
  const app = express();
  app.use(bodyParser.json());
  routes(app, new Engine([]));

  // @ts-ignore
  const res = await request(app).put("/_/api/requests/sequence");
  expect(res.status).toBe(406);
  expect(res.body).toMatchInlineSnapshot(`
    Object {
      "actual": "Received 0 requests",
      "expected": "At least 2 requests",
      "message": "At least 2 requests is needed for verifying a sequence",
      "records": Array [],
    }
  `);
});

test("return the error from a failed verification", async () => {
  const app = express();
  app.use(bodyParser.json());
  routes(app, new Engine([]));

  const res = await request(app)
    // @ts-ignore
    .put("/_/api/requests/sequence")
    .send({
      requests: [
        {
          path: "/tasks",
          method: "POST",
        },
        {
          path: "/tasks",
          method: "GET",
        },
      ],
    });

  expect(res.status).toBe(406);
  expect(res.body).toMatchInlineSnapshot(`
    Object {
      "actual": Array [],
      "expected": Array [
        "POST:/tasks",
        "GET:/tasks",
      ],
      "message": "Requests matched are not matched",
      "records": Array [],
    }
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
    .put("/_/api/requests/sequence")
    .send({
      requests: [
        {
          path: "/tasks",
          method: "POST",
        },
        {
          path: "/tasks",
          method: "GET",
        },
      ],
    });

  expect(res.status).toBe(202);
});

test("return error for unmatched sequence", async () => {
  const app = express();
  app.use(bodyParser.json());
  const engine = new Engine([
    {
      name: "expectations",
      request: { path: "/tasks", method: "GET" },
      response: {},
    },
    {
      name: "expectations",
      request: { path: "/tasks", method: "POST" },
      response: {},
    },
  ]);

  engine.match({ path: "/tasks", method: "GET" });
  engine.match({ path: "/tasks", method: "GET" });

  routes(app, engine);

  const res = await request(app)
    // @ts-ignore
    .put("/_/api/requests/sequence")
    .send({
      requests: [
        {
          path: "/tasks",
          method: "POST",
        },
        {
          path: "/tasks",
          method: "GET",
        },
      ],
    });

  expect(res.status).toBe(406);
});
