---
id: testing
title: Request Validation
sidebar_label: Request Validation
slug: /testing
---

The `behavior-server` includes a feature to valid requests tha it received and matched successfully by the server. Requests that are not matched by any Behavior on the server will result in validation fail.

There are two types of validations that the `behavior-server` supports, count validation and sequence validation.

## Request Counts

The server can validate how many times a request is received and matched if at all.

If the validation passes, the server returns an `HTTP 201` but if fails, the server returns an `HTTP 406` with reason why it fails

### Request was matched at least once

Check if the requests have been received and matched at least once

```shell
# Responds with 201
curl -X PUT http://localhost:8080/_/api/requests/exists -d '[
 {
    "path": "/tasks/123"
 },
 {
    "path": "/tasks/12"
 }
]'
```

### Requests was matched by an upper limit count

Check if the requests have been received and matched `at most` twice

```shell
# Responds with 201 if it were matched
curl -X PUT http://localhost:8080/_/api/requests/exists -d '[
 {
    "path": "/tasks/123",
    "count": {
        "atMost": 2,
    }
 }
]'
```

### Requests was matched by a lower limit count

Check if the requests have been received and matched `at least` twice

```shell
# Responds with 201 if it were matched
curl -X PUT http://localhost:8080/_/api/requests/exists -d '[
 {
    "path": "/tasks/123",
    "count": {
        "atLeast": 2,
    }
 }
]'
```

### Request was matched by an exact number

Check if the requests have been received exactly twice

```shell
# Responds with 201 if it were matched
curl -X PUT http://localhost:8080/_/api/requests/exists -d '[
 {
    "path": "/tasks/123",
    "count": {
        "atMost": 2,
        "atLeast": 2
    }
 }
]'
```

### Request was never received

Check if the requests was never matched

```shell
# Responds with 201 if it were matched
curl -X PUT http://localhost:8080/_/api/requests/exists -d '[
 {
    "path": "/tasks/123",
    "count": {
        "atMost": 0,
    }
 }
]'
```

## Request Sequence

The `behavior-server` can also match the order in which requests are received by the server.

### Requests were received in a particular order

Check if the requests were received in the specific order

```shell
# Responds with 201 if it were matched
curl -X PUT http://localhost:8080/_/api/requests/sequence -d '[
 {
    "path": "/tasks/123"
 },
 {
    "path": "/tasks/123/docs/icon.png"
 }
]'
```
