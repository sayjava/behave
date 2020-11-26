import express from "express";
import { Engine } from "flyt-engine";
import bodyParser from "body-parser";
import routes from "../src/middlewares/express";
import request from "supertest";

test("add a successful expectation", async () => {
  const app = express();
  app.use(bodyParser.json());
  const engine = new Engine([
    {
      name: "test expectations",
      request: { path: "/tasks", method: "GET" },
      response: {},
    },
  ]);

  routes(app, engine);

  const res = await request(app)
    // @ts-ignore
    .post("/_/api/expectations")
    .send({
      expectations: [
        {
          name: "test expectations",
          request: { path: "/tasks", method: "POST" },
          response: {},
        },
      ],
    });

  expect(res.status).toBe(201);
});

test("fail adding expectation not an array", async () => {
  const app = express();
  app.use(bodyParser.json());
  const engine = new Engine([
    {
      name: "test expectations",
      request: { path: "/tasks", method: "GET" },
      response: {},
    },
  ]);

  routes(app, engine);

  const res = await request(app)
    // @ts-ignore
    .post("/_/api/expectations")
    .send({
      expectations: {
        name: "test expectations",
        request: { path: "/tasks", method: "POST" },
        response: {},
      },
    });

  expect(res.status).toBe(400);
  expect(res.body).toMatchInlineSnapshot(`
    Object {
      "message": "Expectations must be an array",
    }
  `);
});

test("fail adding a non valid expectation", async () => {
  const app = express();
  app.use(bodyParser.json());
  const engine = new Engine([
    {
      name: "test expectations",
      request: { path: "/tasks", method: "GET" },
      response: {},
    },
  ]);

  routes(app, engine);

  const res = await request(app)
    // @ts-ignore
    .post("/_/api/expectations")
    .send({
      expectations: [
        {
          name: "test expectations",
          request: { method: "POST" },
          response: {},
        },
      ],
    });

  expect(res.status).toBe(400);
  expect(res.body).toMatchInlineSnapshot(`
    Object {
      "actual": Array [
        "method",
      ],
      "expected": Array [
        "path",
      ],
      "message": "expected { method: 'POST' } to contain key 'path'",
    }
  `);
});

test("remove an expectation", async () => {
  const app = express();
  app.use(bodyParser.json());
  const engine = new Engine([
    {
      id: "sample-expectation",
      name: "test expectations",
      request: { path: "/tasks", method: "GET" },
      response: {},
    },
  ]);

  routes(app, engine);

  const res = await request(app)
    // @ts-ignore
    .delete("/_/api/expectations/sample-expectation");

  expect(res.status).toBe(201);
  expect(res.body).toMatchInlineSnapshot(`
    Object {
      "message": "ok",
    }
  `);
});

test("retrieve all expectations", async () => {
  const app = express();
  app.use(bodyParser.json());
  const engine = new Engine([
    {
      id: "sample-expectation",
      name: "test expectations",
      request: { path: "/tasks", method: "GET" },
      response: {},
    },
  ]);

  routes(app, engine);

  const res = await request(app)
    // @ts-ignore
    .get("/_/api/expectations");

  expect(res.status).toBe(200);
  expect(res.body).toMatchInlineSnapshot(`
    Array [
      Object {
        "id": "sample-expectation",
        "limit": "unlimited",
        "name": "test expectations",
        "request": Object {
          "method": "GET",
          "path": "/tasks",
        },
        "response": Object {},
      },
    ]
  `);
});
