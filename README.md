# Behavior

The easiest way to mock http endpoints for development and tests

## Quick Start

```console
behavior-server "[{"request": {"path":"/hello"}, "response": {"body": "Hello World"}}"
```

## Features (Mock Server)

- Regex based URL matchers e.g 
```shell 
curl -v -X PUT http://localhost:8080/_/api/behaviors -d '{ 
  "name": "Match any task with id",
  "request": { "path": "/tasks/[0-9]+" }, 
  "response": "found it"
}'
``` 
to match e.g 
```shell
curl -v -X GET http://localhost:8080/task/2
curl -v -X GET http://localhost:8080/task/10
```

- Respond based on request header properties e.g `{"user-agent": "Chrome|Apple*"}`
```shell 
curl -v -X PUT http://localhost:8080/_/api/behaviors -d '{ 
  "name": "Match requests coming from Apple devices or Chrome",
  "request": { 
      "path": "/tasks/[0-9]+",
      "headers: {
        "user-agent": "Chrome|Apple*"
      }
  }, 
  "response": [
    {
      "name": "Created on the mac"
    }
  ]
}'
``` 
to match e.g 
```shell
curl -v -X GET http://localhost:8080/task/2 -H {"user-agent": "Chrome"}
```

- Response based on http request body e.g `{"user":"john_doe"}`
- Simulate network delays and failures
- Alternate responses for the same request. e.g succeed first then fail afterwards

## Features (HTTP Server)

- Validate received requests. e.g `/_/api -x PUT `
- Validate the order in which requests are received

## Server Features

- REST based API configuration
- Simple UI log viewer
- Embed server library in an end-to-end test

### Documentation Website

[Documentation](https://behaviour.dev)
