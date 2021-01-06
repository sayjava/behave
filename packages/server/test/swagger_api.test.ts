import apiSpec from '../src/open_api';

describe('Swagger API', () => {
    test('behaviors are generated per response for each requests', async () => {
        const behaviors = await apiSpec({ uri: 'fixtures/bigcommerce_swagger.json' });

        const userEndpoints = behaviors.filter((b) => b.request.path === '/orders/:order_id/transactions$');
        expect(userEndpoints).toMatchInlineSnapshot(`
            Array [
              Object {
                "description": "Returns an **order's** transactions. 

            **Usage Notes**
            * Depending on the payment method, different information will be available (not all payment gateways return full card or fraud detail).
            * Transactions are not created for the following payment methods:
            	* Test Payment Gateway
            	* PayPal Express
            	* Amazon Pay",
                "name": "getTransactions",
                "request": Object {
                  "body": Object {},
                  "headers": Object {
                    "content-type": "text/plain",
                  },
                  "method": "GET",
                  "path": "/orders/:order_id/transactions$",
                  "pathParams": Object {
                    "order_id": "[0-9]+",
                  },
                  "queryParams": Object {},
                },
                "response": Object {
                  "body": Object {
                    "message": "fixtures/orders/{order_id}/transactions/get/200.json does not exists on this server. To  See https://sayjava.github.io/behave/api_spec",
                  },
                  "statusCode": "200",
                },
              },
              Object {
                "description": "Returns an **order's** transactions. 

            **Usage Notes**
            * Depending on the payment method, different information will be available (not all payment gateways return full card or fraud detail).
            * Transactions are not created for the following payment methods:
            	* Test Payment Gateway
            	* PayPal Express
            	* Amazon Pay",
                "name": "getTransactions",
                "request": Object {
                  "body": Object {},
                  "headers": Object {
                    "content-type": "text/plain",
                  },
                  "method": "GET",
                  "path": "/orders/:order_id/transactions$",
                  "pathParams": Object {
                    "order_id": "[0-9]+",
                  },
                  "queryParams": Object {},
                },
                "response": Object {
                  "body": Object {
                    "message": "fixtures/orders/{order_id}/transactions/get/204.json does not exists on this server. To  See https://sayjava.github.io/behave/api_spec",
                  },
                  "statusCode": "204",
                },
              },
              Object {
                "description": "Returns an **order's** transactions. 

            **Usage Notes**
            * Depending on the payment method, different information will be available (not all payment gateways return full card or fraud detail).
            * Transactions are not created for the following payment methods:
            	* Test Payment Gateway
            	* PayPal Express
            	* Amazon Pay",
                "name": "getTransactions",
                "request": Object {
                  "body": Object {},
                  "headers": Object {
                    "content-type": "text/plain",
                  },
                  "method": "GET",
                  "path": "/orders/:order_id/transactions$",
                  "pathParams": Object {
                    "order_id": "[0-9]+",
                  },
                  "queryParams": Object {},
                },
                "response": Object {
                  "body": Object {
                    "message": "fixtures/orders/{order_id}/transactions/get/404.json does not exists on this server. To  See https://sayjava.github.io/behave/api_spec",
                  },
                  "statusCode": "404",
                },
              },
            ]
        `);
    });

    // TODO: implement optional path parameters
    test.skip('optional enum query parameters', async () => {
        const behaviors = await apiSpec({ uri: 'fixtures/bigcommerce_swagger.json' });
        const [endpoints] = behaviors.filter((b) => b.request.path === '/projects/:project_id/collaborators$');

        expect(endpoints).toMatchInlineSnapshot(`
            Object {
              "description": "Lists the collaborators for an organization project. For a project, the list of collaborators includes outside collaborators, organization members that are direct collaborators, organization members with access through team memberships, organization members with access through default organization permissions, and organization owners. You must be an organization owner or a project \`admin\` to list collaborators.",
              "name": "projects/list-collaborators",
              "request": Object {
                "body": Object {},
                "headers": Object {
                  "content-type": "application/json",
                },
                "method": "GET",
                "path": "/projects/:project_id/collaborators$",
                "pathParams": Object {
                  "project_id": "[0-9]+",
                },
                "queryParams": Object {},
              },
              "response": Object {
                "body": Object {
                  "message": "fixtures/projects/{project_id}/collaborators/get/200.json does not exists on this server. To  See https://sayjava.github.io/behave/api_spec",
                },
                "statusCode": "200",
              },
            }
        `);
    });

    test('create request body with inline content', async () => {
        const behaviors = await apiSpec({ uri: 'fixtures/bigcommerce_swagger.json' });
        const [endpoints] = behaviors.filter(
            (b) => b.request.path === '/orders/:order_id/payment_actions/refund_quotes$',
        );

        expect(endpoints).toMatchInlineSnapshot(`
            Object {
              "description": "Calculate the tax amount, total refund amount and get availble payment options for an order refund by providing items and costs or quantities to refund.",
              "name": "postrefundquote",
              "request": Object {
                "body": Object {
                  "items": ".*",
                  "order_id": "[0-9]+",
                },
                "headers": Object {
                  "content-type": "text/plain",
                },
                "method": "POST",
                "path": "/orders/:order_id/payment_actions/refund_quotes$",
                "pathParams": Object {
                  "order_id": "[0-9]+",
                },
                "queryParams": Object {},
              },
              "response": Object {
                "body": Object {
                  "message": "fixtures/orders/{order_id}/payment_actions/refund_quotes/post/201.json does not exists on this server. To  See https://sayjava.github.io/behave/api_spec",
                },
                "statusCode": "201",
              },
            }
        `);
    });

    test('create responses from the filesystem', async () => {
        const behaviors = await apiSpec({ uri: 'fixtures/bigcommerce_swagger.json', basePath: 'fixtures' });
        const [at200, ...rest] = behaviors.filter(
            (b) => b.request.path === '/orders/:order_id/metafields/:metafield_id$',
        );
        const [at404] = rest.reverse();

        expect(at200).toMatchInlineSnapshot(`
            Object {
              "delay": 0,
              "description": "Gets a \`Metafield\`, by \`order_id\`.
            ",
              "limit": "unlimited",
              "name": "getOrderMetafieldByOrderIdAndMetafieldId",
              "request": Object {
                "body": Object {},
                "headers": Object {
                  "content-type": "text/plain",
                },
                "method": "GET",
                "path": "/orders/:order_id/metafields/:metafield_id$",
                "pathParams": Object {},
                "queryParams": Object {},
              },
              "response": Object {
                "body": Object {
                  "meta_field": "Safely returned metatfield",
                },
                "headers": Object {},
                "statusCode": "200",
              },
            }
        `);

        expect(at404).toMatchInlineSnapshot(`
            Object {
              "delay": 0,
              "description": "Deletes a \`Metafield\`.
            ",
              "limit": "unlimited",
              "name": "deleteOrderMetafieldById",
              "request": Object {
                "body": Object {},
                "headers": Object {
                  "content-type": "text/plain",
                },
                "method": "DELETE",
                "path": "/orders/:order_id/metafields/:metafield_id$",
                "pathParams": Object {},
                "queryParams": Object {},
              },
              "response": Object {
                "body": Object {
                  "meta_field": "deleted meta field successfully",
                },
                "headers": Object {},
                "statusCode": "204",
              },
            }
        `);
    });
});
