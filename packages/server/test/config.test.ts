import request from "supertest";
import server from "../src/server";

test("default keep alive path", async () => {
  const { app } = await server({
    engine: { match: () => [] } as any,
  });

  // @ts-ignore
  const res = await request(app).get("/_/healthz");
  expect(res.status).toBe(200);
  expect(res.text).toMatchInlineSnapshot(`"Ok"`);
});

test("configured keep alive path", async () => {
  const { app } = await server({
    engine: { match: () => [] } as any,
    healthCheck: "/i_am_alive",
  });

  // @ts-ignore
  const res = await request(app).get("/i_am_alive");
  expect(res.status).toBe(200);
  expect(res.text).toMatchInlineSnapshot(`"Ok"`);
});

test("default keep ready path", async () => {
  const { app } = await server({
    engine: { match: () => [] } as any,
  });

  // @ts-ignore
  const res = await request(app).get("/_/readyz");
  expect(res.status).toBe(200);
  expect(res.text).toMatchInlineSnapshot(`"Ok"`);
});

test("configured keep ready path", async () => {
  const { app } = await server({
    engine: { match: () => [] } as any,
    readyCheck: "/i_am_ready",
  });

  // @ts-ignore
  const res = await request(app).get("/i_am_ready");
  expect(res.status).toBe(200);
  expect(res.text).toMatchInlineSnapshot(`"Ok"`);
});
