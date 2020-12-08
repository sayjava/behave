import { Engine } from "@sayjava/behave-engine";
import bodyParser from "body-parser";
import express from "express";
import request from "supertest";
import routes from "../src/middlewares/express";

test("add a successful behavior", async () => {
  const app = express();
  app.use(bodyParser.json());
  const engine = new Engine([
    {
      name: "test behaviors",
      request: { path: "/tasks", method: "GET" },
      response: {},
    },
  ]);

  routes(app, { behaviors: [] });

  const res = await request(app)
    // @ts-ignore
    .post("/_/api/behaviors")
    .send([
      {
        name: "test behaviors",
        request: { path: "/tasks", method: "POST" },
        response: {},
      },
    ]);

  expect(res.status).toBe(201);
});

test("fail adding behavior not an array", async () => {
  const app = express();
  app.use(bodyParser.json());

  routes(app, {
    behaviors: [
      {
        name: "test behaviors",
        request: { path: "/tasks", method: "GET" },
        response: {},
      },
    ],
  });

  const res = await request(app)
    // @ts-ignore
    .post("/_/api/behaviors")
    .send({
      name: "test behaviors",
      request: { path: "/tasks", method: "POST" },
      response: {},
    });

  expect(res.status).toBe(400);
  expect(res.body).toMatchInlineSnapshot(`
    Object {
      "message": "Behaviors must be an array",
    }
  `);
});

test("fail adding a non valid behavior", async () => {
  const app = express();
  app.use(bodyParser.json());

  routes(app, {
    behaviors: [
      {
        name: "test behaviors",
        request: { path: "/tasks", method: "GET" },
        response: {},
      },
    ],
  });

  const res = await request(app)
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

test("remove an behavior", async () => {
  const app = express();
  app.use(bodyParser.json());

  routes(app, {
    behaviors: [
      {
        id: "sample-behavior",
        name: "test behaviors",
        request: { path: "/tasks", method: "GET" },
        response: {},
      },
    ],
  });

  const res = await request(app)
    // @ts-ignore
    .delete("/_/api/behaviors/sample-behavior");

  expect(res.status).toBe(201);
  expect(res.body).toMatchInlineSnapshot(`
    Object {
      "message": "ok",
    }
  `);
});

test("retrieve all behaviors", async () => {
  const app = express();
  app.use(bodyParser.json());

  routes(app, {
    behaviors: [
      {
        id: "sample-behavior",
        name: "test behaviors",
        request: { path: "/tasks", method: "GET" },
        response: {},
      },
    ],
  });

  const res = await request(app)
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
