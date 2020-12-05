---
id: start
title: Quick Start
sidebar_label: Start
slug: /
---

```shell
npx behavior-server --behaviors '[{"request": {"path":"/hi"}, "response": {"body": "Hello World"}}]'
```

This will start the sever on port 8080 and ready to receive requests at `http://localhost:8080/hi` e.g

```shell
curl http://localhost:8080/hi
```

### Server Options

| Configuration |   Default   | Description                                    |
| ------------- | :---------: | :--------------------------------------------- |
| --behaviors   |    none     | JSON Array of Behavior documents               |
| --port        |    8080     | The port the sever should listen on            |
| --debug       |    info     | Server debug level `warn`, `verbose` or `info` |
| --healthz     | /\_/healthz | The keep-live path for the server              |
| --readyz      | /\_/readyz  | The ready path for the server                  |

## Initialize Behaviors

When started, the server will look for a folder called `behaviors` in the current working directory and will attempt to load any json or yml files in that directory as a [Behavior Document](guide.md#Server-Behavior).
