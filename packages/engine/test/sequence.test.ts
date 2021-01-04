import { create } from '../src/engine';
import { Behavior, Request, VerificationError } from '../src/types';

const behaviors: Behavior[] = [
    {
        id: 'addProduct',
        name: 'addProduct',
        request: {
            path: '/addProduct',
            method: 'POST',
        },
        response: {
            body: [{ id: 2, text: 'get request' }],
        },
    },
    {
        id: 'getProduct',
        name: 'getProduct',
        request: {
            method: 'GET',
            path: '/getProduct',
        },
        response: {
            body: [],
        },
    },
    {
        id: 'deleteProduct',
        name: 'deleteProduct',
        request: {
            method: 'DELETE',
            path: '/deleteProduct',
        },
        response: {
            body: [],
        },
    },
];

const requests: Request[] = [
    {
        path: '/addProduct',
        method: 'POST',
    },
    {
        path: '/getProduct',
        method: 'GET',
    },
    {
        path: '/deleteProduct',
        method: 'DELETE',
    },
];

const delayFor = (duration = 0) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
};

test('at least 2 requests are needed', () => {
    const engine = create({ behaviors, config: {} });
    engine.match(requests[0]);
    engine.match(requests[1]);

    expect(engine.assertSequence(requests.slice(0, 1))).toMatchInlineSnapshot(`
    Object {
      "actual": "Received 1 requests",
      "expected": "At least 2 requests",
      "message": "At least 2 requests is needed for verifying a sequence",
      "records": Array [],
    }
  `);
});

test('confirm request sequences', async () => {
    const engine = create({ behaviors, config: {} });

    engine.match(requests[0]);
    await delayFor(100);
    engine.match(requests[1]);
    await delayFor(100);
    engine.match(requests[2]);

    expect(engine.assertSequence(requests)).toMatchInlineSnapshot(`true`);
});

test('confirm various combination of requests', async () => {
    const engine = create({ behaviors, config: {} });

    engine.match(requests[0]);
    await delayFor(100);
    engine.match(requests[1]);
    await delayFor(100);
    engine.match(requests[1]);
    await delayFor(100);
    engine.match(requests[2]);
    await delayFor(100);
    engine.match(requests[0]);
    await delayFor(100);
    engine.match(requests[2]);
    await delayFor(100);
    engine.match(requests[1]);

    expect(engine.assertSequence(requests)).toMatchInlineSnapshot(`true`);
});

test('confirm missing requests in sequence fails', async () => {
    const engine = create({ behaviors, config: {} });

    engine.match(requests[0]);
    await delayFor(100);

    engine.match(requests[2]);

    await delayFor(100);
    engine.match(requests[2]);

    const urls = (engine.assertSequence(requests) as VerificationError).records.map((r) => r.request.path);

    expect(urls).toMatchInlineSnapshot(`
    Array [
      "/addProduct",
      "/deleteProduct",
      "/deleteProduct",
    ]
  `);
});

test('confirm missing requests in sequence fails', async () => {
    const engine = create({ behaviors, config: {} });

    engine.match(requests[2]);
    await delayFor(100);

    engine.match(requests[0]);
    await delayFor(100);

    engine.match(requests[1]);

    const { actual, expected } = (engine.assertSequence(requests) as VerificationError) as VerificationError;

    expect(expected).toMatchInlineSnapshot(`
    Array [
      "POST:/addProduct",
      "GET:/getProduct",
      "DELETE:/deleteProduct",
    ]
  `);

    expect(actual).toMatchInlineSnapshot(`
    Array [
      "DELETE:/deleteProduct",
      "POST:/addProduct",
      "GET:/getProduct",
    ]
  `);
});

test('confirm missing requests in sequence verification fails', async () => {
    const engine = create({ behaviors, config: {} });

    engine.match(requests[2]);
    await delayFor(100);

    engine.match(requests[0]);
    await delayFor(100);

    engine.match(requests[1]);

    const { actual, expected } = engine.assertSequence([requests[0], requests[2]]) as VerificationError;

    expect(expected).toMatchInlineSnapshot(`
    Array [
      "POST:/addProduct",
      "DELETE:/deleteProduct",
    ]
  `);

    expect(actual).toMatchInlineSnapshot(`
    Array [
      "DELETE:/deleteProduct",
      "POST:/addProduct",
    ]
  `);
});

test('confirm fails on empty requests', async () => {
    const engine = create({ behaviors, config: {} });

    const { actual, expected } = engine.assertSequence(requests) as VerificationError;

    expect(expected).toMatchInlineSnapshot(`
    Array [
      "POST:/addProduct",
      "GET:/getProduct",
      "DELETE:/deleteProduct",
    ]
  `);

    expect(actual).toMatchInlineSnapshot(`Array []`);
});

test('confirm fails on different header types', async () => {
    const engine = create({
        behaviors: [
            {
                name: 'behaviors',
                request: { path: '/tasks', method: 'GET' },
                response: {},
            },
            {
                name: 'behaviors',
                request: { path: '/tasks', method: 'POST' },
                response: {},
            },
        ],
        config: {},
    });

    engine.match({ path: '/tasks', method: 'POST' });
    await delayFor(100);

    engine.match({ path: '/tasks', method: 'GET' });
    await delayFor(100);

    const { actual, expected } = engine.assertSequence([
        { path: '/tasks', method: 'GET' },
        { path: '/tasks', method: 'POST' },
    ]) as VerificationError;

    expect(expected).toMatchInlineSnapshot(`
    Array [
      "GET:/tasks",
      "POST:/tasks",
    ]
  `);

    expect(actual).toMatchInlineSnapshot(`
    Array [
      "POST:/tasks",
      "GET:/tasks",
    ]
  `);
});
