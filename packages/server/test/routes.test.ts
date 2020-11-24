import server from "../src/server";
import request from "supertest";

describe("expectations", () => {
  test("return a 404 for an empty expectation", async () => {
    const { app } = await server({
      engine: {
        match: () => [],
      },
    });

    const res = await request(app).get("/todos/2");
    expect(res.status).toBe(404);
    expect(res.header["content-type"]).toMatchInlineSnapshot(
      `"application/json; charset=utf-8"`
    );
    expect(res.body).toMatchInlineSnapshot(`
      Object {
        "path": "/todos/2",
      }
    `);
  });

  test("return a 200 for no status code", async () => {
    const { app } = await server({
      engine: {
        match: () => [
          {
            response: {
              body: "show the landscape",
            },
          },
        ],
      },
    });

    const res = await request(app).get("/todos/2");
    expect(res.status).toBe(200);
    expect(res.text).toMatchInlineSnapshot(`"show the landscape"`);
    expect(res.headers["content-type"]).toMatchInlineSnapshot(
      `"text/html; charset=utf-8"`
    );
  });

  test("uses application/json for object types", async () => {
    const { app } = await server({
      engine: {
        match: () => [
          {
            response: {
              body: { message: "show landscapes" },
            },
          },
        ],
      },
    });

    const res = await request(app).get("/todos/2");
    expect(res.status).toBe(200);
    expect(res.text).toMatchInlineSnapshot(
      `"{\\"message\\":\\"show landscapes\\"}"`
    );
    expect(res.headers["content-type"]).toMatchInlineSnapshot(
      `"application/json; charset=utf-8"`
    );
  });

  test("include headers from response", async () => {
    const { app } = await server({
      engine: {
        match: () => [
          {
            response: {
              headers: {
                "x-cache-hit": true,
                "x-correlation-id": "abc123",
              },
              body: { message: "show landscapes" },
            },
          },
        ],
      },
    });

    const res = await request(app).get("/todos/2");
    expect(res.status).toBe(200);
    expect(res.text).toMatchInlineSnapshot(
      `"{\\"message\\":\\"show landscapes\\"}"`
    );
    expect(res.headers["x-cache-hit"]).toMatchInlineSnapshot(`"true"`);
    expect(res.headers["x-correlation-id"]);
    expect(res.headers["x-cache-hit"]);
  });

  test("uses the timer for delayed responses", async (done) => {
    const { app } = await server({
      engine: {
        match: () => [
          {
            response: {
              body: { message: "show landscapes" },
              delay: 50,
            },
          },
        ],
      },
    });

    request(app)
      .get("/todos/2")
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });
});
