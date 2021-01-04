import { createServer } from 'http';
import request from 'supertest';
import createHandler from '../../src/handlers';

// console.log = jest.fn();
test('validates that query parameters work', async () => {
    const requestHandler = createHandler({
        config: {
            behaviors: [
                {
                    name: 'test expectations',
                    request: {
                        path: '/tasks',
                        method: 'GET',
                        queryParams: {
                            id: '[a-z]',
                        },
                    },
                    response: {
                        body: 'Query worked',
                    },
                },
            ],
        },
    });

    const server = createServer(requestHandler);
    const res = await request(server).get('/tasks?id=visitShop').send();

    expect(res.status).toBe(200);
    expect(res.text).toMatchInlineSnapshot(`"\\"Query worked\\""`);
});

test('validates that path parameters work', async () => {
    const requestHandler = createHandler({
        config: {
            behaviors: [
                {
                    name: 'test expectations',
                    request: {
                        path: '/tasks/:id/doc/:docId',
                        method: 'GET',
                        pathParams: {
                            id: '[a-z]+',
                            docId: '[a-z]+',
                        },
                    },
                    response: {},
                },
            ],
        },
    });

    const server = createServer(requestHandler);
    const res = await request(server).get('/tasks/apple/doc/new').send();

    expect(res.status).toBe(200);
});

test('validates that the middle ware mounts on the route', async () => {
    const requestHandler = createHandler({
        config: {
            behaviors: [
                {
                    name: 'test expectations',
                    request: {
                        path: '/tasks/:id/doc/:docId',
                        method: 'GET',
                        pathParams: {
                            id: '[a-z]+',
                            docId: '[a-z]+',
                        },
                    },
                    response: {},
                },
            ],
        },
    });

    const server = createServer(requestHandler);
    const res = await request(server).get('/api/tasks/apple/doc/new').send();

    expect(res.status).toBe(200);
});
