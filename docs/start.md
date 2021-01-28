---
id: start
title: Quick Start
sidebar_label: Start
slug: /
nav_order: 1
---

Behave is a robust HTTP mocking and test server that can be used in development to easily mock out HTTP endpoints for other clients to rely on.

## Quick Start

```shell
npx @sayjava/behave --behaviors '[{"request": {"path":"/hi"}, "response": {"body": "Hello World"}}]'
```

This will start the sever on port `8080` and ready to receive requests at `http://localhost:8080`.

The server can be tested by sending this request to the server

```shell
curl http://localhost:8080/hi
```

## Server Options

| Configuration       |    Default     | Description                                                       |
| ------------------- | :------------: | :---------------------------------------------------------------- |
| \--behaviors, -b    |      none      | JSON Array of Behavior documents                                  |
| \--from-file, -f    | behaviors.json | Path to a json file containing an array of behavior configuration |
| \--open-api, -a     |      none      | uri (file/http(s)) location of an Open API 3.0/Swagger 2.0 file   |
| \--port, -p         |      8080      | The port the sever should listen on                               |
| \--debug, -d        |      info      | Server debug level `warn`, `verbose` or `info`                    |
| \--healthCheck, -he |  /\_/healthz   | The keep-live path for the server                                 |
| \--readyCheck, -re  |   /\_/readyz   | The ready path for the server                                     |

## Initialize Behaviors

When started, the server will look for a filed called `behaviors.json` in the current working directory and will load all the behaviors defined in the file see the [Behavior Document](/guide).

an example `behaviors.json` file looks like:

```json
[
    {
        "request": {
            "path": "/hi"
        },
        "response": {
            "body": "Hello World"
        }
    }
]
```

by just running

```shell
npx @sayjava/behave
```

The server will auto load the behaviors in the file.

[Learn more about behaviors](/guide)

## Express Middleware

The server can also be used as an express middleware in an existing application.

```javascript
const express = require('express');
const { behaveHandler } = require('@sayjava/behave');

const app = express();

app.use(express.static(__dirname + '/views'));

app.get('/', function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!' });
});

app.use(behaveHandler({ config: { fromFile: 'behaviors.json' } }));

app.listen(3000, () => {
    console.info(`Weather ite started on 3000`);
});
```
