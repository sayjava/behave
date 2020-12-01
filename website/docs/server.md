---
id: server
title: Behavior Server
sidebar_label: Server
slug: /
---

## Quick Start

```shell
npx behavior-server -b '[{"request": {"path":"/hi"}, "response": {"body": "Hello World"}}]'
```

This will start the sever on port 8080 and ready to receive requests

```shell
curl http://localhost:8080/hi
```

### Server Options

| Configuration |   Default   | Description                         |
| ------------- | :---------: | :---------------------------------- |
| --port        |    8080     | The port the sever should listen on |
| --debug       |    info     | Server debug level                  |
| --healthz     | /\_/healthz | Keep alive path                     |
| --readyz      | /\_/readyz  | Ready path                          |

## Initialize Behaviors

When started, the server will look for a folder called `behaviors` in the present directory and will attempt to load any json or yml files in that directory as a [Behavior document](endpoints.md#Server-Behavior).

## Server API Endpoints

The server reserves the `http://localhost:8080/_/*` paths for the integrated UI and API endpoints.

### Create Behaviors

The server stores its behaviors by default in memory

PUT `http://localhost:8080/_/api/behaviors`

Example Request

```shell
# Responds with a 201
curl -X PUT http://localhost:8080/_/api/behaviors -d '[
    {
        "requests":{
            "path": "/hi"
        }
    },
    {
        "requests":{
            "path": "/halo"
        }
    }
]'
```

see more about [Behaviors](endpoints.md#Server-Behavior) here

### Retrieve Configured Behaviors

Retrieve all the configured behaviors on the server.

GET `http://localhost:8080/_/api/behaviors`

Example Request

```shell
# Responds with a 200 and configured behaviors
curl -X GET http://localhost:8080/_/api/behaviors
```

### Retrieve Received Requests

The server stores all the received requests alongside the matched Behaviors.

GET `http://localhost:8080/_/api/records`

Example Request

```shell
# Responds with a 200 and a list of requests and matched behaviors
curl -X GET http://localhost:8080/_/api/records
```

### Validate Received Requests

The server can validate if requests that matches have been received. see [Validation](testing.md) for more information on validating requests.

GET `http://localhost:8080/_/api/requests/exists`

Example Request

```shell
# Responds with a 201 if the requests have been received
curl -X PUT http://localhost:8080/_/api/requests/exists -d '[
    {
        "requests": "/hi"
    },
    {
        "requests": "/halo"
    }
]'
```

### Validate Received Requests Order

The server can validate if requests that matches have been received in a specific order. see [Validation](testing.md) for more information on validating requests.

GET `http://localhost:8080/_/api/requests/sequence`

Example Request

```shell
# Responds with a 201 if the requests have been received in that sequence
curl -X PUT http://localhost:8080/_/api/requests/sequence -d '[
    {
        "requests": "/hi"
    },
    {
        "requests": "/halo"
    }
]'
```

### Server UI

`http://localhost:8080/_/ui`

The server has an integrated UI to view request logs and configured Behaviors
