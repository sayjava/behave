---
home: true
heroImage: /assets/img/landing.svg
tagline: A robust HTTP mocking server to rapidly aid application development and system testing
actionText: Get Started →
actionLink: /start/
features:
    - title: Declarative
      details:  Define request and response behaviors in YAML/JSON documents checked into your repo.
    - title: HTTP Assertions
      details: Assert HTTP requests made from system under test using a RESTful API
    - title: Open API & Swagger
      details: Point Behave to an Open API 3.0 or Swagger 2.0 spec file and get an API server.
footer: MIT Licensed
---

## Quick Start
```bash
$ npx @sayjava/behave --behaviors '[{"request": {"path":"/todos/[0-9]+"},"response": {"body": [{ "name": "run_app" }]}}]'
```

```bash
$ curl http://localhost:8080/todos/4
```
## Programmatic Middleware

```javascript
const express = require('express');
const { behaveHandler } = require('@sayjava/behave');

const app = express();

app.get('/', (req, res) => res.json({ title: 'Hey', message: 'Hello there!' }));

// use behave as a middleware
app.use('/api/', behaveHandler({ config: { fromFile: 'behaviors.json' } }));

app.listen(3000, () => console.info(`Weather ite started on 3000`));
```