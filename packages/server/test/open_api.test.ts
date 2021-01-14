import apiSpec from '../src/open_api';

describe('Open API', () => {
    test('behaviors are generated per response for each requests', async () => {
        const behaviors = await apiSpec({ uri: 'fixtures/github_api.json' });

        const userEndpoints = behaviors.filter((b) => b.request.path === '/projects/columns/:column_id/moves$');
        expect(userEndpoints).toMatchInlineSnapshot(`
            Array [
              Object {
                "description": "",
                "name": "projects/move-column",
                "request": Object {
                  "body": Object {
                    "position": "^(?:first|last|after:\\\\d+)$",
                  },
                  "headers": Object {},
                  "method": "POST",
                  "path": "/projects/columns/:column_id/moves$",
                  "pathParams": Object {
                    "column_id": "[0-9]+",
                  },
                  "queryParams": Object {},
                },
                "response": Object {
                  "body": Object {
                    "message": "fixtures/projects/columns/{column_id}/moves/post/201.json does not exists on this server. To  See https://sayjava.github.io/behave/api_spec",
                  },
                  "statusCode": "201",
                },
              },
              Object {
                "description": "",
                "name": "projects/move-column",
                "request": Object {
                  "body": Object {
                    "position": "^(?:first|last|after:\\\\d+)$",
                  },
                  "headers": Object {},
                  "method": "POST",
                  "path": "/projects/columns/:column_id/moves$",
                  "pathParams": Object {
                    "column_id": "[0-9]+",
                  },
                  "queryParams": Object {},
                },
                "response": Object {
                  "body": Object {
                    "message": "fixtures/projects/columns/{column_id}/moves/post/304.json does not exists on this server. To  See https://sayjava.github.io/behave/api_spec",
                  },
                  "statusCode": "304",
                },
              },
              Object {
                "description": "",
                "name": "projects/move-column",
                "request": Object {
                  "body": Object {
                    "position": "^(?:first|last|after:\\\\d+)$",
                  },
                  "headers": Object {},
                  "method": "POST",
                  "path": "/projects/columns/:column_id/moves$",
                  "pathParams": Object {
                    "column_id": "[0-9]+",
                  },
                  "queryParams": Object {},
                },
                "response": Object {
                  "body": Object {
                    "message": "fixtures/projects/columns/{column_id}/moves/post/401.json does not exists on this server. To  See https://sayjava.github.io/behave/api_spec",
                  },
                  "statusCode": "401",
                },
              },
              Object {
                "description": "",
                "name": "projects/move-column",
                "request": Object {
                  "body": Object {
                    "position": "^(?:first|last|after:\\\\d+)$",
                  },
                  "headers": Object {},
                  "method": "POST",
                  "path": "/projects/columns/:column_id/moves$",
                  "pathParams": Object {
                    "column_id": "[0-9]+",
                  },
                  "queryParams": Object {},
                },
                "response": Object {
                  "body": Object {
                    "message": "fixtures/projects/columns/{column_id}/moves/post/403.json does not exists on this server. To  See https://sayjava.github.io/behave/api_spec",
                  },
                  "statusCode": "403",
                },
              },
              Object {
                "description": "",
                "name": "projects/move-column",
                "request": Object {
                  "body": Object {
                    "position": "^(?:first|last|after:\\\\d+)$",
                  },
                  "headers": Object {},
                  "method": "POST",
                  "path": "/projects/columns/:column_id/moves$",
                  "pathParams": Object {
                    "column_id": "[0-9]+",
                  },
                  "queryParams": Object {},
                },
                "response": Object {
                  "body": Object {
                    "message": "fixtures/projects/columns/{column_id}/moves/post/422.json does not exists on this server. To  See https://sayjava.github.io/behave/api_spec",
                  },
                  "statusCode": "422",
                },
              },
            ]
        `);
    });

    test('optional enum query parameters', async () => {
        const behaviors = await apiSpec({ uri: 'fixtures/github_api.json' });
        const [endpoints] = behaviors.filter((b) => b.request.path === '/projects/:project_id/collaborators$');

        expect(endpoints).toMatchInlineSnapshot(`
            Object {
              "description": "Lists the collaborators for an organization project. For a project, the list of collaborators includes outside collaborators, organization members that are direct collaborators, organization members with access through team memberships, organization members with access through default organization permissions, and organization owners. You must be an organization owner or a project \`admin\` to list collaborators.",
              "name": "projects/list-collaborators",
              "request": Object {
                "body": Object {},
                "headers": Object {},
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

    test('boolean query parameters', async () => {
        const behaviors = await apiSpec({ uri: 'fixtures/github_api.json' });
        const [endpoints] = behaviors.filter((b) => b.request.path === '/licenses$');

        expect(endpoints).toMatchInlineSnapshot(`
            Object {
              "description": "",
              "name": "licenses/get-all-commonly-used",
              "request": Object {
                "body": Object {},
                "headers": Object {},
                "method": "GET",
                "path": "/licenses$",
                "pathParams": Object {},
                "queryParams": Object {},
              },
              "response": Object {
                "body": Object {
                  "message": "fixtures/licenses/get/200.json does not exists on this server. To  See https://sayjava.github.io/behave/api_spec",
                },
                "statusCode": "200",
              },
            }
        `);
    });

    test('create request body with inline content', async () => {
        const behaviors = await apiSpec({ uri: 'fixtures/github_api.json' });
        const [endpoints] = behaviors.filter((b) => b.request.path === '/markdown$');

        expect(endpoints).toMatchInlineSnapshot(`
            Object {
              "description": "",
              "name": "markdown/render",
              "request": Object {
                "body": Object {
                  "context": "[a-zA-Z]+",
                  "mode": "markdown|gfm",
                  "text": "[a-zA-Z]+",
                },
                "headers": Object {},
                "method": "POST",
                "path": "/markdown$",
                "pathParams": Object {},
                "queryParams": Object {},
              },
              "response": Object {
                "body": Object {
                  "message": "fixtures/markdown/post/200.json does not exists on this server. To  See https://sayjava.github.io/behave/api_spec",
                },
                "statusCode": "200",
              },
            }
        `);
    });

    test('create responses from the filesystem', async () => {
        const behaviors = await apiSpec({ uri: 'fixtures/github_api.json', basePath: 'fixtures' });
        const [at200, ...rest] = behaviors.filter((b) => b.request.path === '/user/followers$');
        const [at403] = rest.reverse();

        expect(at200).toMatchInlineSnapshot(`
            Object {
              "delay": 10,
              "description": "Lists the people following the authenticated user.",
              "limit": 5,
              "name": "users/list-followers-for-authenticated-user",
              "request": Object {
                "body": Object {},
                "headers": Object {},
                "method": "GET",
                "path": "/user/followers$",
                "pathParams": Object {},
                "queryParams": Object {},
              },
              "response": Object {
                "body": Array [
                  Object {
                    "username": "john.doe",
                  },
                  Object {
                    "username": "jane.doe",
                  },
                ],
                "headers": Object {
                  "content-type": "application/json",
                },
                "statusCode": "200",
              },
            }
        `);

        expect(at403).toMatchInlineSnapshot(`
            Object {
              "delay": 0,
              "description": "Lists the people following the authenticated user.",
              "limit": "unlimited",
              "name": "users/list-followers-for-authenticated-user",
              "request": Object {
                "body": Object {},
                "headers": Object {},
                "method": "GET",
                "path": "/user/followers$",
                "pathParams": Object {},
                "queryParams": Object {},
              },
              "response": Object {
                "body": Object {
                  "message": "sorry didn't happen",
                },
                "headers": Object {
                  "content-type": "application/json",
                  "x-github-response": "sorry-not-allowed",
                },
                "statusCode": "403",
              },
            }
        `);
    });
});
