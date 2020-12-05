---
id: api
title: Server API
sidebar_label: API
slug: /api
---

The server reserves the `http://localhost:8080/_/*` paths for the integrated UI and the API endpoints.

## Behaviors

### Create

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

see more about [Behaviors](start.md#Server-Behavior) here

### Delete

DELETE `http://localhost:8080/_/api/behaviors/:id`

Example Request

```shell
# Responds with a 201
curl -X DELETE http://localhost:8080/_/api/behaviors/:id
```

see more about [Behaviors](guide.md#Server-Behavior) here

### Retrieve Configured Behaviors

Retrieve all the configured behaviors on the server.

GET `http://localhost:8080/_/api/behaviors`

Example Request

```shell
# Responds with a 200 and configured behaviors
curl -X GET http://localhost:8080/_/api/behaviors
```

## Records

The server stores all the received requests alongside the matched Behaviors.

### Retrieve Records

GET `http://localhost:8080/_/api/records`

Example Request

```shell
# Responds with a 200 and a list of requests and matched behaviors
curl -X GET http://localhost:8080/_/api/records
```

## Reset Server

DELETE `http://localhost:8080/_/api/records`

```shell
# Clear all records and behaviors
curl -X DELETE http://localhost:8080/_/api/records
```

## Server UI

`http://localhost:8080/_/ui`

The server has an integrated UI to view request logs and configured Behaviors
