import { create } from "../src/engine";
import {
  Behavior,
  Request,
  Verification,
  VerificationError,
} from "../src/types";

test("at most 1 time and at least 1 time", () => {
  const behaviors: Behavior[] = [
    {
      id: "exp1",
      name: "sample1",
      request: {
        headers: {},
        path: "/todos",
        method: "GET",
      },
      response: {
        statusCode: 200,
      },
    },
    {
      id: "exp1",
      name: "sample1",
      request: {
        headers: {},
        path: "/todos",
        method: "POST",
      },
      response: {
        statusCode: 200,
      },
    },
  ];

  const engine = create({ behaviors, config: {} });

  const post: Request = {
    path: "/todos",
    method: "POST",
    headers: {},
  };

  const get: Request = {
    path: "/todos",
    method: "GET",
    headers: {},
  };

  engine.match(get);
  engine.match(get);

  const verificationPost: Verification = {
    request: post,
    limit: { atMost: 1 },
  };
  const verifiedPost = engine.assert(verificationPost);
  expect(verifiedPost).toMatchInlineSnapshot(`true`);

  const verificationGet: Verification = {
    request: get,
    limit: { atLeast: 1 },
  };
  const verifiedGet = engine.assert(verificationGet);
  expect(verifiedGet).toMatchInlineSnapshot(`true`);
});

test("exactly 2 times", () => {
  const behaviors: Behavior[] = [
    {
      id: "exp1",
      name: "sample1",
      request: {
        headers: {},
        path: "/todos",
        method: "GET",
      },
      response: {
        statusCode: 200,
      },
    },
  ];

  const engine = create({ behaviors, config: {} });

  const request: Request = {
    path: "/todos",
    method: "GET",
    headers: {},
  };

  engine.match(request);
  engine.match(request);
  engine.match(request);
  engine.match(request);

  const verification: Verification = {
    request,
    limit: { atMost: 2, atLeast: 2 },
  };
  const verified = engine.assert(verification) as VerificationError;

  expect(verified.message).toMatchInlineSnapshot(
    `"Expected to have received GET:/todos at most 2 times but was received 4 times"`
  );
});

test("matches at least once", () => {
  const behaviors: Behavior[] = [
    {
      id: "exp1",
      name: "sample1",
      request: {
        headers: {},
        path: "/todo/2",
        method: "GET",
      },
      response: {
        statusCode: 200,
      },
      limit: 1,
    },
  ];

  const engine = create({ behaviors, config: {} });

  const request: Request = {
    path: "/todo/2",
    method: "GET",
    headers: {},
  };

  const verification: Verification = {
    request,
  };

  engine.match(request);
  const verified = engine.assert(verification);

  expect(verified).toMatchInlineSnapshot(`true`);
});

test("at least 1 times with other records", () => {
  const behaviors: Behavior[] = [
    {
      id: "exp1",
      name: "sample1",
      request: {
        path: "/todos$",
        method: "GET",
      },
      response: {
        statusCode: 200,
      },
      limit: 1,
    },
  ];

  const engine = create({ behaviors, config: {} });

  const request: Request = {
    path: "/todos/take-trash-out",
    method: "GET",
  };

  engine.match(request);
  engine.match(request);
  engine.match(request);
  engine.match(request);

  const verification: Verification = { request, limit: { atLeast: 1 } };
  const verified = engine.assert(verification) as VerificationError;

  expect(verified.message).toMatchInlineSnapshot(
    `"Expected to have received GET:/todos/take-trash-out at least 1 times but was received 0 times"`
  );
});

test("assert 3 counts on a 2 limit response", () => {
  const behaviors: Behavior[] = [
    {
      id: "exp1",
      name: "sample1",
      request: {
        headers: {},
        path: "/happy_feet",
        method: "GET",
      },
      response: {
        statusCode: 200,
      },
      limit: 2,
    },
  ];

  const engine = create({ behaviors, config: {} });

  const request: Request = {
    path: "/happy_feet",
    method: "GET",
    headers: {},
  };

  engine.match(request);
  engine.match(request);
  engine.match(request);
  engine.match(request);
  engine.match(request);

  const verification: Verification = {
    request,
    limit: { atLeast: 3 },
  };
  const verified = engine.assert(verification) as VerificationError;

  expect(verified.message).toMatchInlineSnapshot(
    `"Expected to have received GET:/happy_feet at least 3 times but was received 2 times"`
  );
});

test("at most 3 times", () => {
  const behaviors: Behavior[] = [
    {
      id: "exp1",
      name: "sample1",
      request: {
        headers: {},
        path: "/todos",
        method: "GET",
      },
      response: {
        statusCode: 200,
      },
    },
  ];

  const engine = create({ behaviors, config: {} });

  const request: Request = {
    path: "/todos",
    method: "GET",
    headers: {},
  };

  engine.match(request);
  engine.match(request);
  engine.match(request);
  engine.match(request);

  const verification: Verification = { request, limit: { atMost: 3 } };
  const verified = engine.assert(verification) as VerificationError;

  expect(verified.message).toMatchInlineSnapshot(
    `"Expected to have received GET:/todos at most 3 times but was received 4 times"`
  );
});

test("at least 3 times", () => {
  const behaviors: Behavior[] = [
    {
      id: "exp1",
      name: "sample1",
      request: {
        headers: {},
        path: "/todos",
        method: "GET",
      },
      response: {
        statusCode: 200,
      },
    },
  ];

  const engine = create({ behaviors, config: {} });

  const request: Request = {
    path: "/todos",
    method: "GET",
    headers: {},
  };

  engine.match(request);
  engine.match(request);
  engine.match(request);
  engine.match(request);

  const verification: Verification = { request, limit: { atLeast: 3 } };
  const verified = engine.assert(verification);

  expect(verified).toMatchInlineSnapshot(`true`);
});

test("empty record matches", () => {
  const behaviors: Behavior[] = [
    {
      id: "exp1",
      name: "sample1",
      request: {
        headers: {},
        path: "/todos",
        method: "GET",
      },
      response: {
        statusCode: 200,
      },
      limit: 1,
    },
  ];

  const engine = create({ behaviors, config: {} });

  const request: Request = {
    path: "/todos",
    method: "GET",
    headers: {},
  };

  const verification: Verification = {
    request,
  };

  const verified = engine.assert(verification);

  expect(verified).toMatchInlineSnapshot(`
    Object {
      "actual": 0,
      "expected": 1,
      "message": "Expected to have received GET:/todos at least 1 times but was received 0 times",
      "records": Array [],
    }
  `);
});
