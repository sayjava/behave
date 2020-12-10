import { createServer } from "http";
import request from "supertest";
import createHandler from "../../src/handlers";

test("return a 406  for empty requests", async () => {
  const requestHandler = createHandler({ config: { behaviors: [] } });
  const server = createServer(requestHandler);

  // @ts-ignore
  const res = await request(server).put("/_/api/requests/sequence");
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
  const requestHandler = createHandler({ config: { behaviors: [] } });
  const server = createServer(requestHandler);

  const res = await request(server)
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
  const requestHandler = createHandler({
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

  const server = createServer(requestHandler);

  // @ts-ignore
  await request(server).post("/tasks");
  // @ts-ignore
  await request(server).get("/tasks");

  const res = await request(server)
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
  const requestHandler = createHandler({
    config: {
      behaviors: [
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
      ],
    },
  });

  const server = createServer(requestHandler);
  request(server).get("/tasks");
  request(server).get("/tasks");

  const res = await request(server)
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
