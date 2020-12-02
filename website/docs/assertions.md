---
id: assertions
title: Assertions
sidebar_label: Assertions
slug: /assertions
---

The `behave` includes a feature to valid requests tha it received and matched successfully by the server. Requests that are not matched by any Behavior on the server will result in validation fail.

There are two types of validations that the `behave` supports, count validation and sequence validation.

## Counts

The server can validate how many times a request is received and matched if at all.

If the validation passes, the server returns an `HTTP 201` but if fails, the server returns an `HTTP 406` with reason why it fails

### Request was matched at least once

Check if the requests have been received and matched at least once

```shell
# Responds with 201
curl -X PUT http://localhost:8080/_/api/requests/assert -d '[
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
curl -X PUT http://localhost:8080/_/api/requests/assert -d '[
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
curl -X PUT http://localhost:8080/_/api/requests/assert -d '[
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
curl -X PUT http://localhost:8080/_/api/requests/assert -d '[
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
curl -X PUT http://localhost:8080/_/api/requests/assert -d '[
 {
   "path": "/tasks/123",
   "count": {
      "atMost": 0,
   }
 }
]'
```

### Requests were received at least at an interval

Check if this request was received more than once and at least `time` in seconds apart. This will implicitly require that at least 2 requests was received and matched

```shell
# Check that requests were received at least 10 seconds apart
# Responds with 201 if it were matched
curl -X PUT http://localhost:8080/_/api/requests/assert -d '[
 {
   "path": "/tasks/123",
   "interval": {
      "atLeast": 10,
   }
 }
]'
```

### Requests were received at most at an interval

Check if this request was received more than once and at least `time` in seconds apart. This will implicitly require that at most 2 requests was received and matched

```shell
# Check that requests were received at most 10 seconds apart
# Responds with 201 if it were matched
curl -X PUT http://localhost:8080/_/api/requests/assert -d '[
 {
   "path": "/tasks/123",
   "interval": {
      "atMost": 10,
   }
 }
]'
```

## Sequence

The `behave` can also match the order in which requests are received by the server.

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
