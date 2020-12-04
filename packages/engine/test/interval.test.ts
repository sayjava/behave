import { create } from "../src/engine";
import { Expectation, Request, VerificationError } from "../src/types";

const expectations: Expectation[] = [
  {
    id: "addProduct",
    name: "addProduct",
    request: {
      path: "/addProduct",
      method: "POST",
    },
    response: {
      body: [{ id: 2, text: "get request" }],
    },
  },
  {
    id: "getProduct",
    name: "getProduct",
    request: {
      method: "GET",
      path: "/getProduct",
    },
    response: {
      body: [],
    },
  },
  {
    id: "deleteProduct",
    name: "deleteProduct",
    request: {
      method: "DELETE",
      path: "/deleteProduct",
    },
    response: {
      body: [],
    },
  },
];

const requests: Request[] = [
  {
    path: "/addProduct",
    method: "POST",
  },
  {
    path: "/getProduct",
    method: "GET",
  },
  {
    path: "/deleteProduct",
    method: "DELETE",
  },
];

const delayFor = (duration = 0) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

test("at least 2 requests are needed to have been matched", () => {
  const engine = create({ expectations, config: {} });
  engine.match(requests[0]);

  const error = engine.assertInterval({
    requests,
    interval: { atLeast: 10 },
  }) as VerificationError;

  expect(error.expected).toMatchInlineSnapshot(
    `"All asserted requests must have matched records"`
  );
});

test("all asserted records must match at least once", async () => {
  const engine = create({ expectations, config: {} });
  engine.match(requests[0]);
  await delayFor(100);
  engine.match(requests[1]);
  await delayFor(100);
  engine.match(requests[1]);

  const error = engine.assertInterval({
    requests,
    interval: { atLeast: 10 },
  }) as VerificationError;

  expect(error.actual).toMatchInlineSnapshot(`"/deleteProduct has no records"`);
});

test("confirm request are called apart at least 50 seconds apart", async () => {
  const engine = create({ expectations, config: {} });

  engine.match(requests[0]);
  await delayFor(100);
  engine.match(requests[1]);
  await delayFor(100);
  engine.match(requests[2]);

  expect(
    engine.assertInterval({ requests, interval: { atLeast: 50 } })
  ).toMatchInlineSnapshot(`true`);
});

test("confirm request are NOT called apart at least 50 seconds apart", async () => {
  const engine = create({ expectations, config: {} });

  engine.match(requests[0]);
  await delayFor(100);
  engine.match(requests[1]);
  await delayFor(30);
  engine.match(requests[1]);
  await delayFor(70);
  engine.match(requests[2]);

  expect(
    engine.assertInterval({ requests, interval: { atLeast: 50 } })
  ).not.toEqual(true);
});

test("confirm request are called apart at most 50 seconds apart", async () => {
  const engine = create({ expectations, config: {} });

  engine.match(requests[0]);
  await delayFor(40);
  engine.match(requests[1]);
  await delayFor(40);
  engine.match(requests[2]);

  expect(
    engine.assertInterval({ requests, interval: { atMost: 50 } })
  ).toMatchInlineSnapshot(`true`);
});

test("confirm request are called apart at most 50 seconds apart", async () => {
  const engine = create({ expectations, config: {} });

  engine.match(requests[0]);
  await delayFor(40);
  engine.match(requests[0]);
  await delayFor(80);
  engine.match(requests[0]);
  await delayFor(40);
  engine.match(requests[1]);
  await delayFor(70);
  engine.match(requests[2]);

  expect(
    engine.assertInterval({ requests, interval: { atMost: 50 } })
  ).not.toEqual(true);
});
