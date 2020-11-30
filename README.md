# Behavior

The easiest way to mock http endpoints for development and tests purposes

## Quick Start

```shell
behavior-server '[{"request": {"path":"/hello"}, "response": {"message": "Hello World"}}]'
```

```shell
curl -X GET http://localhost:8080/hello
```

## Uses Cases

- Rapid UI/App Development using `behavior-server` as a backend
- Test lambda@edge logic by using `behavior-server` as an origin
- End-to-End tests using simulating all possible server responses

## Features (Mocking Endpoints)

- Regex based URL matchers e.g

```shell
curl -v -X PUT http://localhost:8080/_/api/behaviors -d '[
  {
    "name": "Match any task with id",
    "request": { "path": "/tasks/[0-9]+" },
    "response": "found it"
  }
]
'
```

to match e.g

```shell
curl -v -X GET http://localhost:8080/task/2
curl -v -X GET http://localhost:8080/task/10
```

- Respond based on request header properties e.g `{"user-agent": "Chrome|Apple*"}`

```shell
curl -v -X PUT http://localhost:8080/_/api/behaviors -d '[
  {
    "name": "Match requests coming from Apple devices or Chrome",
    "request": {
      "path": "/tasks/[0-9]+",
      "headers": {
        "user-agent": "Chrome|Apple*"
      }
    },
    "response": [
      {
        "name": "Created on the mac"
      }
    ]
  }
]
'
```

to match e.g

```shell
curl -v -X GET http://localhost:8080/task/2 -H 'user-agent: Chrome'
```

- Response based on http request body e.g `{"user":"john_[a-z]+"}`

```shell
curl -v -X PUT http://localhost:8080/_/api/behaviors -d '[{
  "name": "Match requests with users with names like john_xxx",
  "request": {
    "path": "/tasks",
    "method": "POST",
    "body": {
      "user": "john_[a-z]+"
    }
  },
  "response": [
    {
      "statusCode": "201",
      "body": "Task created"
    }
  ]
}]
'
```

to match e.g

```shell
curl -v -X POST http://localhost:8080/tasks -d '{ "user": "john_doe", "name": "pay up" }'
```

- Simulate network delays and failures

- Alternate responses for the same request. e.g succeed twice then fail afterwards

```shell
curl -v -X PUT http://localhost:8080/_/api/behaviors -d '[
  {
    "request": {
      "path": "/hello/world"
    },
    "response": {
      "statusCode": "200",
      "body": "Hello there"
    },
    "limit": 2
  },
  {
    "request": {
      "path": "/hello/world"
    },
    "response": {
      "statusCode": "500",
      "body": "Sorry Server Blew Up"
    }
  }
]
'
```

## Features (HTTP Test Server)

- Validate received requests. e.g

```shell
curl -v -X PUT http://localhost:8080/_/api/requests/exists -d `[
    {
        "path": "/hello/world",
        "count": {
            "atMost": 2
        }
    }
]`
```

- Validate the order in which requests are received

```shell
curl -v -X PUT http://localhost:8080/_/api/requests/sequence -d `[
    {
        "path": "/hello/world",
    },
    {
        "path": "/hello/earth",
    }
]`
```

## Server Features

- HTTP based API configuration
- Simple UI log and behavior viewer
- Embed server library in an end-to-end test

### Documentation Website

[Full Documentation](https://behaviour.dev)
