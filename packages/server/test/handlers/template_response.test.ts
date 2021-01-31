import { createServer } from 'http';
import request from 'supertest';
import createHandler from '../../src/handlers/index';

const requestHandler = createHandler({ config: { fromFile: 'fixtures/templated_behaviors.yml' } });

test('inline template response', async () => {
    const server = createServer(requestHandler);
    const res = await request(server).get('/todo/2');

    expect(res.body).toMatchInlineSnapshot(`
        Object {
          "path": "/todo/2",
        }
    `);
});

test('file based template response', async () => {
    const server = createServer(requestHandler);
    const res = await request(server)
        .post('/todos?isDone=true')
        .send({
            name: 'take out the bin',
            owner: 'me',
        })
        .set('Cookie', 'active=true;accepted=false');

    expect(res.body).toMatchInlineSnapshot(`
        Object {
          "accepted": "false",
          "done": "true",
          "owner": "me",
          "text": "take out the bin",
          "url": "/todos",
        }
    `);
});
