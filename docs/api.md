---
id: api
title: Server API
sidebar_label: API
slug: /api
has_toc: true
nav_order: 4
---

## Behave Server API

## Table of contents
{: .no_toc .text-delta }


## Behavior 

The endpoint to interact with the behave server is at `http://localhost:8080/_/api/behaviors`


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

### Get Behaviors

Retrieve all the configured behaviors on the server.

GET `http://localhost:8080/_/api/behaviors`

Example Request

```shell
# Responds with a 200 and configured behaviors
curl -X GET http://localhost:8080/_/api/behaviors
```

## Records

The server stores all the received requests alongside the matched Behaviors.

### Get Records

GET `http://localhost:8080/_/api/records`

Example Request

```shell
# Responds with a 200 and a list of requests and matched behaviors
curl -X GET http://localhost:8080/_/api/records
```

## Delete All records

DELETE `http://localhost:8080/_/api/records`

```shell
# Clear all records and behaviors
curl -X DELETE http://localhost:8080/_/api/records
```

