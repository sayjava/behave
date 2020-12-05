import { loadBehaviors } from "../src/bin/index";

test("can load behaviors from a file", () => {
  expect(loadBehaviors({ fromFile: "./fixtures/behaviors.json" }))
    .toMatchInlineSnapshot(`
    Array [
      Object {
        "name": "Successful todo",
        "request": Object {
          "method": "GET",
          "path": "/todo/[0-9]+",
        },
        "response": Object {
          "body": Object {
            "id": 2,
            "text": "The todo body",
          },
        },
      },
      Object {
        "name": "Failed todo",
        "request": Object {
          "method": "GET",
          "path": "/todo/[0-9]+",
        },
        "response": Object {
          "body": "Server blew up",
        },
      },
    ]
  `);
});

test("will load from strings", () => {
  expect(
    loadBehaviors({ behaviors: '[{"request":{ "path": "/helloWorld" } }]' })
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "name": "Behavior",
        "request": Object {
          "path": "/helloWorld",
        },
        "response": Object {
          "statusCode": 200,
        },
      },
    ]
  `);
});
