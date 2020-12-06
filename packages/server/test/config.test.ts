import request from "supertest";
import server from "../src/server";

test("default keep alive path", async () => {
  const { app } = await server({
    behaviors: [],
  });

  // @ts-ignore
  const res = await request(app).get("/_/healthz");
  expect(res.status).toBe(200);
  expect(res.text).toMatchInlineSnapshot(`"Ok"`);
});

test("configured keep alive path", async () => {
  const { app } = await server({
    behaviors: [],
    healthCheck: "/i_am_alive",
  });

  // @ts-ignore
  const res = await request(app).get("/i_am_alive");
  expect(res.status).toBe(200);
  expect(res.text).toMatchInlineSnapshot(`"Ok"`);
});

test("default keep ready path", async () => {
  const { app } = await server({
    behaviors: [],
  });

  // @ts-ignore
  const res = await request(app).get("/_/readyz");
  expect(res.status).toBe(200);
  expect(res.text).toMatchInlineSnapshot(`"Ok"`);
});

test("configured keep ready path", async () => {
  const { app } = await server({
    behaviors: [],
    readyCheck: "/i_am_ready",
  });

  // @ts-ignore
  const res = await request(app).get("/i_am_ready");
  expect(res.status).toBe(200);
  expect(res.text).toMatchInlineSnapshot(`"Ok"`);
});

test("load behaviors from a file", async () => {
  const { app } = await server({
    fromFile: "./fixtures/behaviors.json",
    readyCheck: "/i_am_ready",
  });

  // @ts-ignore
  const res = await request(app).get("/todo/2");
  expect(res.status).toBe(200);
  expect(res.text).toMatchInlineSnapshot(
    `"{\\"id\\":2,\\"text\\":\\"The todo body\\"}"`
  );
});
