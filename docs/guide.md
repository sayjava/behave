---
id: guide
title: Guide
---

# Behavior Guide

The `Behave` server uses behaviors to respond to http requests it receives. The server matches the requests it receives to the list of configured behaviors. It will use the first matched behavior as a response to the request and when it can't match a request to a behavior, it will return an http `404` response back to the client

## Behavior Configuration

A Behavior is a configuration object that describes how the `behave` server should respond to http requests it receives.

Behaviors can be created on the server by sending an http request to the behavior endpoint of the server. e.g

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

The server can also be initialized with a set of behaviors at start up as described [here](guide.md#configure)

Here is a full sample of a Behavior document.

```json
{
  "name": "Optional name of this behavior",

  "description": "Optional description for this behavior",

  "request": {
    "path": "a/path/to/match",
    "headers": {
      "x-some-custom-header": "any value"
    },
    "body": "json/text"
  },

  "response": {
    "statusCode": "any http status code",
    "body": "json object/text",
    "headers": {},
    "delay": "seconds to delay the response. defaults to 0"
  },

  "limit": "how many times this behavior should be used. defaults to unlimited"
}
```

## Request

To be able to match a Behavior and respond appropriately, a Behavior document needs a request property that describes how the server should match the http requests it receives.

### Simple Path

The `behave` server will default to `HTTP GET` method and `HTTP 200` response code for matched Behaviors if they are omitted from the Behavior document.

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
# Responds with a 200 Ok "A sample task"
curl -X GET http://localhost:8080/tasks/a_simple_task

# Responds with a 404 Not Found
curl -X GET http://localhost:8080/tasks/another_task
```

### Regex Paths

Behaviors can use regex paths for matching a request to a configured Behavior. e.g

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
# Responds with a 200 Ok
curl -X GET http://localhost:8080/tasks/123

# Responds with a 200 Ok
curl -X GET http://localhost:8080/tasks/2

# Responds with a 404 Not Found
curl -X GET http://localhost:8080/tasks/a_simple_taks
```

### Path Parameters

The server can match http requests using dynamic path parameters e.g

```json
{
  "request": {
    "path": "/tasks/{id}/docs/{docId}",
    "pathParams": {
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
# Responds with a 200
curl -X GET http://localhost:8080/tasks/123/doc/image.jpg

# Responds with a 404
curl -X GET http://localhost:8080/tasks/123/doc/cat.png
```

### Query Parameters

The server can also match dynamic query parameters. e.g

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
# Responds with a 200
curl -X GET http://localhost:8080/tasks/123?isCompleted=true
```

### Headers

The server can match requests based on http request header values. The configured request header values will matched as a subset of the received request headers.

```json
{
  "request": {
    "path": "/tasks/[0-9]+",
    "headers": {
      "X-Behave-Id": "behave-[a-z]+"
    }
  },
  "response": {
    "body": {
      "name": "match header values"
    }
  }
}
```

```shell
# Responds with a 200
curl -X GET http://localhost:8080/tasks/123 -H "X-Behave-Id: behave-abcde"

# Responds with a 404
curl -X GET http://localhost:8080/tasks/123
```

### Request Methods

```json
{
  "request": {
    "path": "/tasks/[0-9]+",
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
# Respond with a 200
curl -X DELETE http://localhost:8080/tasks/123

# Respond with a 404
curl http://localhost:8080/tasks/123
```

### Request Body

Behaviors can also be matched using the request body. The server will inspect the content-type of the request method to determine how to handle the request body.

#### JSON Body

Http requests with a `Content-Type: application/json` header will have its body treated like a json object. The request body will be matched as a superset of the Behavior body. e.g

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
    "statusCode": 200,
    "body": {
      "name": "Task has been deleted"
    }
  }
}
```

```shell
# Responds with a 200
curl -X POST http://localhost:8080/tasks -d '{ "name": "simple-task", "user": "john_doe" }' -H "Content-Type: application/json"

# Responds with a 404
curl -X POST http://localhost:8080/tasks -d '{ "name": "simple-task" }' -H "Content-Type: application/json"
```

#### Plain Text Body

Requests without a specified `Content-Type` will default to string

```json
{
  "request": {
    "path": "/tasks",
    "body": "john_doe"
  },
  "response": {
    "statusCode": 200,
    "body": "no tasks for this person"
  }
}
```

```shell
# Responds with a 200
curl -X GET http://localhost:8080/tasks -d '"john_doe"'

# Responds with a 404
curl -X POST http://localhost:8080/tasks -d 'someone_else'
```

#### Regex Body

Behaviors can also be matched using a regex body either as a json document or plain text. e.g

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
# Responds with a 200
curl -X POST http://localhost:8080/tasks -d '{ "name": "task-123", id: 2 }' -H "Content-Type: application/json"

# Responds with a 404
curl -X POST http://localhost:8080/tasks -d '{ "name": "other_tasks", id: 2 }' -H "Content-Type: application/json"
```

## Response

The server response can also be tailored using the Behavior document.

### Limited

The server can limit the amount of instance a Behavior is used to respond to the http requests it matches. Http requests received after the response limit has been reached will result in a `404` response.

The default response limit is `unlimited`. e.g

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
# Responds with a 200
curl -X GET http://localhost:8080/tasks/123

# Responds with a 200
curl -X GET http://localhost:8080/tasks/123

# Responds with a 404
curl -X GET http://localhost:8080/tasks/123
```

Response limits can be combined to create some interesting scenarios, e.g first respond with 200s and then fail afterwards

The first 2 requests will be successful

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

Subsequent requests should fail

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

# Responds with a 200
curl -X GET http://localhost:8080/tasks/123

# Responds with a 200
curl -X GET http://localhost:8080/tasks/123

# Responds with a 500
curl -X GET http://localhost:8080/tasks/123
```

### Delayed

By default, responses are sent immediately to the client when matched but the server can be instructed to delay in seconds when the server should send the response. e.g

```json
{
  "request": {
    "path": "/tasks/123"
  },

  "response": {
    "body": "some tasks",
    "delay": 120
  }
}
```

```shell

# Responds with a 200 after 120 seconds
curl -X GET http://localhost:8080/tasks/123

```
