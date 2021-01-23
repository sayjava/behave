import { create, Engine } from '../src/engine';
import { Behavior, Request } from '../src/types';

test('matched 2 times only', () => {
    const behaviors: Behavior[] = [
        {
            id: 'exp1',
            name: 'sample1',
            request: {
                headers: {},
                path: '/todos',
                method: 'GET',
            },
            response: {
                body: [{ id: 2, text: 'get request' }],
            },
            limit: 2,
        },
    ];

    const request: Request = {
        path: '/todos',
        method: 'GET',
        headers: {},
    };

    const engine = create({ behaviors, config: {} });

    engine.match(request);
    engine.match(request);
    const lastMatch = engine.match(request);

    expect(lastMatch).toMatchInlineSnapshot(`Array []`);
});

test('multiple expectation matches', () => {
    const behaviors: Behavior[] = [
        {
            id: 'exp1',
            name: 'sample1',
            request: {
                headers: {},
                path: '/todos',
                method: 'GET',
            },
            response: {
                statusCode: 200,
            },
            limit: 1,
        },
        {
            id: 'exp2',
            name: 'sample2',
            request: {
                headers: {},
                path: '/todos',
                method: 'GET',
            },
            response: {
                statusCode: 500,
            },
            limit: 'unlimited',
        },
    ];

    const engine = create({ behaviors, config: {} });

    const request: Request = {
        path: '/todos',
        method: 'GET',
        headers: {},
    };

    const successExp = engine.match(request);
    expect(successExp).toMatchInlineSnapshot(`
            Array [
              Object {
                "id": "exp1",
                "limit": 1,
                "name": "sample1",
                "request": Object {
                  "headers": Object {},
                  "method": "GET",
                  "path": "/todos",
                },
                "response": Object {
                  "statusCode": 200,
                },
              },
              Object {
                "id": "exp2",
                "limit": "unlimited",
                "name": "sample2",
                "request": Object {
                  "headers": Object {},
                  "method": "GET",
                  "path": "/todos",
                },
                "response": Object {
                  "statusCode": 500,
                },
              },
            ]
      `);

    const failExp = engine.match(request);
    expect(failExp).toMatchInlineSnapshot(`
            Array [
              Object {
                "id": "exp2",
                "limit": "unlimited",
                "name": "sample2",
                "request": Object {
                  "headers": Object {},
                  "method": "GET",
                  "path": "/todos",
                },
                "response": Object {
                  "statusCode": 500,
                },
              },
            ]
      `);
});

test('matches similar behavior with different limit', () => {
    const behaviors: Behavior[] = [
        {
            id: 'exp1',
            name: 'sample1',
            request: {
                headers: {},
                path: '/todos',
                method: 'GET',
            },
            response: {
                statusCode: 200,
            },
            limit: 1,
        },
        {
            id: 'exp2',
            name: 'sample2',
            request: {
                headers: {},
                path: '/todos',
                method: 'GET',
            },
            response: {
                statusCode: 500,
            },
            limit: 1,
        },
    ];

    const engine = create({ behaviors, config: {} });

    const request: Request = {
        path: '/todos',
        method: 'GET',
        headers: {},
    };

    const resp1 = engine.match(request);
    const resp2 = engine.match(request);
    const resp3 = engine.match(request);

    // matches both behaviors
    expect(resp1).toMatchInlineSnapshot(`
        Array [
          Object {
            "id": "exp1",
            "limit": 1,
            "name": "sample1",
            "request": Object {
              "headers": Object {},
              "method": "GET",
              "path": "/todos",
            },
            "response": Object {
              "statusCode": 200,
            },
          },
          Object {
            "id": "exp2",
            "limit": 1,
            "name": "sample2",
            "request": Object {
              "headers": Object {},
              "method": "GET",
              "path": "/todos",
            },
            "response": Object {
              "statusCode": 500,
            },
          },
        ]
    `);

    // matches only the second behavior
    expect(resp2).toMatchInlineSnapshot(`
        Array [
          Object {
            "id": "exp2",
            "limit": 1,
            "name": "sample2",
            "request": Object {
              "headers": Object {},
              "method": "GET",
              "path": "/todos",
            },
            "response": Object {
              "statusCode": 500,
            },
          },
        ]
    `);

    expect(resp3).toMatchInlineSnapshot(`Array []`);
});
