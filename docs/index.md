---
id: start
title: Quick Start
sidebar_label: Start
slug: /
nav_order: 1
---

# Behave
{: .fs-9 }

Behave is a robust HTTP mocking and test server that can be used in development to easily mock out HTTP endpoints for other clients to rely on.
Just the Docs gives your documentation a jumpstart with a responsive Jekyll theme that is easily customizable and hosted on GitHub Pages.
{: .fs-6 .fw-300 }

## Quick Start

```shell
npx @sayjava/behave --behaviors '[{"request": {"path":"/hi"}, "response": {"body": "Hello World"}}]'
```

This will start the sever on port `8080` and ready to receive requests at `http://localhost:8080/hi`


```shell
curl http://localhost:8080/hi
```

## Server Options

| Configuration       |    Default     | Description                                                       |
| ------------------- | :------------: | :---------------------------------------------------------------- |
| \--behaviors, -b    |      none      | JSON Array of Behavior documents                                  |
| \--from-file, -f    | behaviors.json | Path to a json file containing an array of behavior configuration |
| \--port, -p         |      8080      | The port the sever should listen on                               |
| \--debug, -d        |      info      | Server debug level `warn`, `verbose` or `info`                    |
| \--healthCheck, -he |  /\_/healthz   | The keep-live path for the server                                 |
| \--readyCheck, -re  |   /\_/readyz   | The ready path for the server                                     |

## Initialize Behaviors

When started, the server will look for a filed called `behaviors.json` in the current working directory and will load all the behaviors defined in the file see the [Behavior Document](/guide#Server-Behavior).

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
