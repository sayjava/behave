import { createServer } from 'http';
import request from 'supertest';
import createHandler from '../../src/handlers/index';

test('return accepted http 202', async () => {
    const requestHandler = createHandler({
        config: {
            behaviors: [
                {
                    name: 'test expectations',
                    request: { path: '/tasks?finished=true', method: 'GET' },
                    response: {},
                },
                {
                    name: 'test expectations',
                    request: { path: '/tasks', method: 'POST' },
                    response: {},
                },
            ],
        },
    });

    const server = createServer(requestHandler);
    await request(server).post('/tasks').send();
    await request(server).get('/tasks?finished=true').send();

    const res = await request(server).get('/_/api/records');

    expect(res.status).toBe(200);

    expect(res.body.map((rec) => ({ url: rec.request.path }))).toMatchInlineSnapshot(
        `
    Array [
      Object {
        "url": "/tasks",
      },
      Object {
        "url": "/tasks?finished=true",
      },
    ]
  `,
    );
});
