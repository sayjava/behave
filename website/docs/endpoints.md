---
id: endpoints
title: Configure Endpoints
sidebar_label: Endpoints
slug: /endpoints
---

The primary functionality of `behavior-server` is to mock endpoints

## Behavior

A behavior is a set of instructions on what the server should do upon receipt of a request.

### URL

#### A Simple URL

`curl -v -X PUT "http://localhost:8080/_/api/behaviors" -d ' [{ "request": { "path": "/some/path", }, "response": { "statusCode": 200, "body": "some_response_body" } }]`

#### Regex URL

behavior can match url requests based on

`curl -v -X PUT "http://localhost:8080/_/api/behaviors" -d ' [{ "request": { "path": "/some/path", }, "response": { "statusCode": 200, "body": "some_response_body" } }]`

#### Query Parameters

`curl -v -X PUT "http://localhost:8080/_/api/behaviors" -d ' [{ "request": { "path": "/some/path", }, "response": { "statusCode": 200, "body": "some_response_body" } }]`

#### Path Parameters

`curl -v -X PUT "http://localhost:8080/_/api/behaviors" -d ' [{ "request": { "path": "/some/path", }, "response": { "statusCode": 200, "body": "some_response_body" } }]`

### Headers

#### A Simple URL

`curl -v -X PUT "http://localhost:8080/_/api/behaviors" -d ' [{ "request": { "path": "/some/path", }, "response": { "statusCode": 200, "body": "some_response_body" } }]`

#### Regex URL

behavior can match url requests based on

`curl -v -X PUT "http://localhost:8080/_/api/behaviors" -d ' [{ "request": { "path": "/some/path", }, "response": { "statusCode": 200, "body": "some_response_body" } }]`

#### Query Parameters

`curl -v -X PUT "http://localhost:8080/_/api/behaviors" -d ' [{ "request": { "path": "/some/path", }, "response": { "statusCode": 200, "body": "some_response_body" } }]`

#### Path Parameters

`curl -v -X PUT "http://localhost:8080/_/api/behaviors" -d ' [{ "request": { "path": "/some/path", }, "response": { "statusCode": 200, "body": "some_response_body" } }]`

### Body

#### A Simple URL

`curl -v -X PUT "http://localhost:8080/_/api/behaviors" -d ' [{ "request": { "path": "/some/path", }, "response": { "statusCode": 200, "body": "some_response_body" } }]`

#### Regex URL

behavior can match url requests based on

`curl -v -X PUT "http://localhost:8080/_/api/behaviors" -d ' [{ "request": { "path": "/some/path", }, "response": { "statusCode": 200, "body": "some_response_body" } }]`

#### Query Parameters

`curl -v -X PUT "http://localhost:8080/_/api/behaviors" -d ' [{ "request": { "path": "/some/path", }, "response": { "statusCode": 200, "body": "some_response_body" } }]`

#### Path Parameters

`curl -v -X PUT "http://localhost:8080/_/api/behaviors" -d ' [{ "request": { "path": "/some/path", }, "response": { "statusCode": 200, "body": "some_response_body" } }]`
