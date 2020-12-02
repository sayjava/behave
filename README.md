 <h1 align="center">Behave</h1>
 <p align="center">
The easiest and quickest way to mock HTTP endpoints for development and tests purposes
 </p>
 <p align="center">
    <a href="https://behave.dev"><strong>Explore Behave docs »</strong></a>
 </p>
 <p align="center">
  <a href="website/docs/start">Start »</a>
  <a href="website/docs/guide">Guide »</a>
  <a href="website/docs/api">API »</a>
  <a href="website/docs/assertions">Assertions</a>
 </p>

## Quick Start

```shell
npx @sayjava/behave -b '[{"request": {"path":"/hi"}, "response": {"body": "Hello World"}}]'
```

```shell
curl -X GET http://localhost:8080/hi
```

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

to match requests like:

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

to match requests like:

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

to match requests like:

```shell
curl -v -X POST http://localhost:8080/tasks -d '{ "user": "john_doe", "name": "pay up" }'
```

- Simulate network delays and failures

```shell
curl -v -X PUT http://localhost:8080/_/api/behaviors -d '[
  {
    "name": "Match any task with id",
    "request": {
      "path": "/tasks/[0-9]+",
      "delay": 100
    }
  }
]
'
```

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

[see more examples](website/docs/endpoints.md)

## Features (HTTP Assertion Server)

- Validate received requests. e.g

```shell
# Assert that this request was received at most 2 times
curl -v -X PUT http://localhost:8080/_/api/requests/exists -d `[
    {
        "path": "/hello/world",
        "count": {
            "atMost": 2
        }
    }
]`
```

- Validate the interval between requests

```shell
# Assert that these requests were received at most 10 seconds apart
curl -v -X PUT http://localhost:8080/_/api/requests/sequence -d `
  {
    "path": "/hello/world",
    "interval": {
      "atMost": 10
    }
  }
`
```

- Validate the order in which requests are received

```shell
# Assert that these requests were received in this order
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
- Express middleware

### Full Documentation

[Full Documentation](https://behaviour.dev)
