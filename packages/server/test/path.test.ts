import express from "express";
import bodyParser from "body-parser";
import request from "supertest";
import middleware from "../src/middlewares/express";

// console.log = jest.fn();
test("validates that query parameters work", async () => {
  const app = express();
  app.use(bodyParser.json());

  middleware({
    app,
    config: {
      behaviors: [
        {
          name: "test expectations",
          request: {
            path: "/tasks",
            method: "GET",
            queryParams: {
              id: "[a-z]",
            },
          },
          response: {},
        },
      ],
    },
  });

  const res = await request(app)
    // @ts-ignore
    .get("/tasks?id=visitShop")
    .send();

  expect(res.status).toBe(200);
});

test("validates that path parameters work", async () => {
  const app = express();
  app.use(bodyParser.json());

  middleware({
    app,
    config: {
      behaviors: [
        {
          name: "test expectations",
          request: {
            path: "/tasks/:id/doc/:docId",
            method: "GET",
            pathParams: {
              id: "[a-z]+",
              docId: "[a-z]+",
            },
          },
          response: {},
        },
      ],
    },
  });

  const res = await request(app)
    // @ts-ignore
    .get("/tasks/apple/doc/new")
    .send();

  expect(res.status).toBe(200);
});

test("validates that the middle ware mounts on the route", async () => {
  const app = express();
  app.use(bodyParser.json());

  middleware({
    baseRoute: "/api",
    app,
    config: {
      behaviors: [
        {
          name: "test expectations",
          request: {
            path: "/tasks/:id/doc/:docId",
            method: "GET",
            pathParams: {
              id: "[a-z]+",
              docId: "[a-z]+",
            },
          },
          response: {},
        },
      ],
    },
  });

  const res = await request(app)
    // @ts-ignore
    .get("/api/tasks/apple/doc/new")
    .send();

  expect(res.status).toBe(200);
});
