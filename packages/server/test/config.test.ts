import request from "supertest";
import server from "../src/server";

test("default keep alive path", async () => {
  const { app } = await server({
    engine: { match: () => [] },
  });

  const res = await request(app).get("/_alive");
  expect(res.status).toBe(200);
  expect(res.text).toMatchInlineSnapshot(`"Ok"`);
});

test("configured keep alive path", async () => {
  const { app } = await server({
    engine: { match: () => [] },
    keepAlivePath: "/i_am_alive",
  });

  const res = await request(app).get("/i_am_alive");
  expect(res.status).toBe(200);
  expect(res.text).toMatchInlineSnapshot(`"Ok"`);
});

test("default keep ready path", async () => {
  const { app } = await server({
    engine: { match: () => [] },
  });

  const res = await request(app).get("/_ready");
  expect(res.status).toBe(200);
  expect(res.text).toMatchInlineSnapshot(`"Ok"`);
});

test("configured keep ready path", async () => {
  const { app } = await server({
    engine: { match: () => [] },
    readyPath: "/i_am_ready",
  });

  const res = await request(app).get("/i_am_ready");
  expect(res.status).toBe(200);
  expect(res.text).toMatchInlineSnapshot(`"Ok"`);
});
