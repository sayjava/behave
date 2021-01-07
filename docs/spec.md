---
id: spec
title: Guide
sidebar_label: Open API/Swagger
slug: /spec
has_toc: true
nav_order: 2
---

# Open API 3.0 / Swagger 2.0

Behave supports Open API 3.0 and Swagger 2.0 specification. By pointing behave to a local file or an http location of a `json/yml` specification file, behave will automatically generate routes from the spec file.

## Open API Spec / Swagger Routes

Behave will automatically generate behavior routes for all defined paths in the spec file. There will be a unique behavior for each defined route and response type in the spec file. e.g

Example spec file (a snippet of the Github open spec api file)

```yml
openapi: 3.0.3
servers:
    - url: 'https://api.github.com'
paths:
    /user/followers:
    get:
        description: Lists the people following the authenticated user.
        externalDocs:
            description: API method documentation
            url: 'https://developer.github.com/v3/users/followers/#list-followers-of-the-authenticated-user'
        operationId: users/list-followers-for-authenticated-user
        parameters:
            - $ref: '#/components/parameters/per_page'
            - $ref: '#/components/parameters/page'
        responses:
            '200':
                content:
                    application/json:
                description: response
                headers:
                    Link:
                        $ref: '#/components/headers/link'
            '304':
                $ref: '#/components/responses/not_modified'
            '401':
                $ref: '#/components/responses/requires_authentication'
            '403':
                $ref: '#/components/responses/forbidden'
```

A route is automatically generated for the `GET` route for the `/user/followers` path. 

## Responses

```json
{
    /*
    optional, defaults to {}
    */
    "content": {},

    /*
    optional, defaults to {}
    */
    "headers": {},

    /*
    optional limit, defaults to unlimited 
    */
    "limit": "unlimited",

    /*
    optional delay, defaults to 0 
    */
    "delay": 0
}
```
