# Behavior

The easiest way to mock http endpoints for development and tests

## Quick Start

`behavior-server "[{"request": {"path":"/hello"}, "response": {"body": "Hello World"}}"`

## Features (Mock Server)

- Regex based url matchers e.g `/tasks/[0-9]+` to match `/tasks/2`
- Respond based on request header properties e.g `{"User-Agent": "Apple%"}`
- Response based on http request body e.g `{"user":"john_doe"}`
- Simulate network delays and failures
- Alternate responses for the same request. e.g succeed first then fail afterwards

## Features (HTTP Server)

- Validate received requests. e.g `/_/api -x PUT `
-

## Server Features

- REST based API configuration
- Simple UI log viewer
- Embed server library in an end-to-end test

### Documentation Website

[Documentation](https://behaviour.dev)
