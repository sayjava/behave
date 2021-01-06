import request from 'supertest';
import server from '../src/server';

const debugRecords = async (app) => {
    const res = await request(app).get('/_/api/records');
    return res.body;
};

const debugBehaviors = async (app, path) => {
    const res = await request(app).get('/_/api/behaviors');

    return res.body.filter((b) => b.request.path === path);
};

describe.skip('Open API Server', () => {
    test('path parameters amd request body', async () => {
        const { app } = await server({
            openApi: './fixtures/bigcommerce_swagger.json',
        });

        const res = await request(app)
            .post('/projects/columns/2/moves')
            .set('content-type', 'application/json')
            .send({ position: 'last' });

        expect(res.status).toBe(201);
        expect(res.text).toMatchInlineSnapshot(
            `"{\\"message\\":\\"fixtures/projects/columns/{column_id}/moves/post/201.json does not exists on this server. To  See https://sayjava.github.io/behave/api_spec\\"}"`,
        );
    });

    test('optional query parameters', async () => {
        const { app } = await server({
            openApi: './fixtures/bigcommerce_swagger.json',
        });

        const res = await request(app)
            .get('/user/migrations?page=21&per_page=12')
            .set('content-type', 'application/json');

        expect(res.status).toBe(200);
        expect(res.text).toMatchInlineSnapshot(
            `"{\\"message\\":\\"fixtures/user/migrations/get/200.json does not exists on this server. To  See https://sayjava.github.io/behave/api_spec\\"}"`,
        );
    });

    // test('retrieve response', async () => {
    //     const { app } = await server({
    //         openApi: './fixtures/bigcommerce_swagger.json',
    //     });

    //     const res = await request(app).get('/user/followers').set('content-type', 'application/json');

    //     expect(res.status).toBe(200);
    //     expect(res.text).toMatchInlineSnapshot(`"[{\\"username\\":\\"john.doe\\"},{\\"username\\":\\"jane.doe\\"}]"`);
    // });

    // test('non existing open api file', async () => {
    //     console.error =  jest.fn();
    //     console.warn =  jest.fn();

    //     const { app } = await server({
    //         openApi: './fixtures/none_existing_api.json',
    //     });

    //     const res = await request(app).get('/user/followers').set('content-type', 'application/json');
    //     expect(res.status).toBe(404);

    //     expect(console.error).toHaveBeenLastCalledWith(`OPEN API ERROR: `, new Error(`Error opening file "/Users/raymondottun/Projects/behave/packages/server/fixtures/none_existing_api.json"`))
    // });

    
});
