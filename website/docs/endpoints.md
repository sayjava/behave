---
id: endpoints
title: Configure Endpoint Behavior
sidebar_label: Endpoints
slug: /endpoints
---

The primary functionality of `behavior-server` is to mock endpoints that can then be invoked by clients to respond with the configured response.

If the `behavior-server` receives a request with no configured behavior, it will return an HTTP `404` response with the requested path.

## Behavior

A behavior is a JSON document describing how the `behavior-server` respond to requests

The server will receive behavior documents on `http://localhost:8080/_api/behaviors` with a `PUT` method. e.g

```shell
curl -v -X PUT "http://localhost:8080/_/api/behaviors" -d '[
    {
        "request": {
            "path": "/some/path"
        },
        "response": {
            "statusCode": 200,
            "headers": {
                "content-type": "application/json"
            },
            "body": {
                "message": "some response"
            }
        }
    }
]'

```

Here is a full sample behavior

```json
{
  "name": "Name of this behavior",

  "description": "A description for this behavior",

  "request": {
    "path": "a/path/to/match",
    "headers": {
      "x-some-custom-header": "any value",
      "x-some-custom-regex-header": "a regex value"
    },
    "body": "json/text"
  },

  "response": {
    "statusCode": "any http status code",
    "body": "json/text",
    "headers": {},
    "delay": 0
  },

  "limit": "unlimited"
}
```

## Request

### Default Request and Response values

`behavior-sever` will default to `GET` method and `Http 200` response code for matched behaviors

```json
{
  "request": {
    "path": "/tasks/a_simple_task"
  },
  "response": {
    "body": {
      "name": "A simple task"
    }
  }
}
```

```shell
curl -X GET http://localhost:8080/tasks/a_simple_task
```

### Regex Paths

Behaviors can use regex paths for matching a request

```json
{
  "request": {
    "path": "/tasks/[0-9]+"
  },
  "response": {
    "body": {
      "name": "Regex based url"
    }
  }
}
```

```shell
curl -X GET http://localhost:8080/tasks/123
```

### Path Parameters

```json
{
  "request": {
    "path": "/tasks/{id}/docs/{docId}",
    "queryParameters": {
      "id": "[0-9]+",
      "docId": "[a-z]+.jpg"
    }
  },
  "response": {
    "body": {
      "name": "Task doc"
    }
  }
}
```

```shell
curl -X GET http://localhost:8080/tasks/123/doc/image.jpg
```

### Query Parameters

```json
{
  "request": {
    "path": "/tasks/[0-9]+/?completed={isCompleted}",
    "queryParams": {
      "isCompleted": "true|false"
    }
  },
  "response": {
    "body": {
      "name": "Some completed tasks"
    }
  }
}
```

```shell
curl -X GET http://localhost:8080/tasks/123?isCompleted=true
```

### Headers

`behavior-server` can match requests based on header values. The configured header values will matched as a subset of the received request headers.

```json
{
  "request": {
    "path": "/tasks/[0-9]+/",
    "headers": {
      "Accept": "application/json",
      "X-Behavior-Id": "behave-[a-z]+"
    }
  },
  "response": {
    "body": {
      "name": "match header values"
    }
  }
}
```

### Match Request Methods

```json
{
  "request": {
    "path": "/tasks/[0-9]+/",
    "method": "DELETE"
  },
  "response": {
    "body": {
      "name": "Task has been deleted"
    }
  }
}
```

```shell
curl -X DELETE http://localhost:8080/tasks/123
```

### Simple Request Body

```json
{
  "request": {
    "path": "/tasks",
    "method": "POST",
    "body": {
      "user": "john_doe"
    }
  },
  "response": {
    "statusCode": 201,
    "body": {
      "name": "Task has been deleted"
    }
  }
}
```

```shell
curl -X POST http://localhost:8080/tasks -d '{ "name": "simple-task", "user": "john_doe" }'
```

### Regex Based Body

```json
{
  "request": {
    "path": "/tasks",
    "method": "POST",
    "body": {
      "name": "task-[0-9]+"
    }
  },
  "response": {
    "body": {
      "name": "Task has been deleted"
    }
  }
}
```

```shell
curl -X POST http://localhost:8080/tasks -d '{ "name": "task-123" }'
```

## Response

### Limit

Limit the amount of instance this behavior is used to respond to a request. Any requests received after a second request will result in a `404` response. The default response limit is `unlimited`

```json
{
  "request": {
    "path": "/tasks/123"
  },

  "response": {
    "statusCode": 200,
    "body": "Task 123"
  },
  "limit": 2
}
```

```shell
curl -X GET http://localhost:8080/tasks/123 # 200 ok
curl -X GET http://localhost:8080/tasks/123 # 200 ok
curl -X GET http://localhost:8080/tasks/123 # 404 Not Found
```

This can be combined to create some interesting scenarios, e.g first respond then fail after wards

```json
{
  "request": {
    "path": "/tasks/123"
  },

  "response": {
    "statusCode": 500,
    "body": "Sever blew up"
  }
}
```

```shell
curl -X GET http://localhost:8080/tasks/123 # 200 ok
curl -X GET http://localhost:8080/tasks/123 # 200 ok
curl -X GET http://localhost:8080/tasks/123 # 500 Server Error
```

### Delay

Delay the response by a configured amount of seconds. This is useful for simulating timeouts. This response will be delayed for 120 seconds.

```json
{
  "request": {
    "path": "a/path/to/match"
  },

  "response": {
    "statusCode": "any http status code",
    "body": "json/text",
    "headers": {},
    "delay": 120
  }
}
```
